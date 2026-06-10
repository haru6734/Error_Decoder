import http.server
import socketserver
import os
import json
import urllib.request
import urllib.error
import time

PORT = 8080

# In-memory IP request history: { ip: [timestamp1, timestamp2, ...] }
ip_request_history = {}
IP_LIMIT_WINDOW = 15 * 60  # 15 minutes in seconds
IP_LIMIT_COUNT = 5

def is_rate_limited(client_ip):
    now = time.time()
    if client_ip not in ip_request_history:
        ip_request_history[client_ip] = []
    
    # Filter timestamps within the 15-minute window
    ip_request_history[client_ip] = [t for t in ip_request_history[client_ip] if now - t < IP_LIMIT_WINDOW]
    
    return len(ip_request_history[client_ip]) >= IP_LIMIT_COUNT

def record_request(client_ip):
    now = time.time()
    if client_ip not in ip_request_history:
        ip_request_history[client_ip] = []
    ip_request_history[client_ip].append(now)

class ProxyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/api/analyze':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)

            # Get Client IP (supporting X-Forwarded-For if deployed behind proxies like Vercel/Cloudflare)
            x_forwarded_for = self.headers.get('X-Forwarded-For', '')
            client_ip = x_forwarded_for.split(',')[0].strip() if x_forwarded_for else self.client_address[0]

            # Check Authorization Header for premium users
            auth_header = self.headers.get('Authorization', '')
            is_authenticated = auth_header == 'Bearer test-paid-token'

            # Rate limit check for non-paying users
            if not is_authenticated and is_rate_limited(client_ip):
                self.send_response(429)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'status': 'REQUIRE_AUTH',
                    'message': '15분 내 5회 무료 제공량을 모두 사용하셨습니다. 계속 이용하려면 구글 로그인 및 요금 연동이 필요합니다.'
                }, ensure_ascii=False).encode('utf-8'))
                return

            # Record request timestamp if not authenticated
            if not is_authenticated:
                record_request(client_ip)

            # 1. Read API Key from environment or local .env file
            api_key = os.environ.get('GEMINI_API_KEY', '')
            if not api_key:
                env_path = os.path.join(os.getcwd(), '.env')
                if os.path.exists(env_path):
                    try:
                        with open(env_path, 'r', encoding='utf-8') as f:
                            for line in f:
                                line = line.strip()
                                if line.startswith('GEMINI_API_KEY='):
                                    api_key = line.split('=', 1)[1].strip()
                                    if (api_key.startswith('"') and api_key.endswith('"')) or (api_key.startswith("'") and api_key.endswith("'")):
                                        api_key = api_key[1:-1]
                                    break
                    except Exception as e:
                        print(f"Error reading .env file: {e}")

            if not api_key:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'error': {
                        'message': '서버에 Gemini API Key가 구성되지 않았습니다. .env 파일을 만들고 GEMINI_API_KEY를 기입하거나 환경변수를 설정해 주세요.'
                    }
                }, ensure_ascii=False).encode('utf-8'))
                return

            # 2. Forward payload to Gemini API with retry and fallback models
            models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-3.5-flash']
            success = False
            last_error_code = 500
            last_error_body = b''

            for model in models:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
                
                # Try up to 2 times for each model (1 original + 1 retry if transient error occurs)
                for attempt in range(2):
                    try:
                        req = urllib.request.Request(
                            url,
                            data=post_data,
                            headers={'Content-Type': 'application/json'},
                            method='POST'
                        )
                        with urllib.request.urlopen(req) as response:
                            res_body = response.read()
                            self.send_response(200)
                            self.send_header('Content-Type', 'application/json; charset=utf-8')
                            self.end_headers()
                            self.wfile.write(res_body)
                            success = True
                            break
                    except urllib.error.HTTPError as e:
                        last_error_code = e.code
                        try:
                            last_error_body = e.read()
                            error_json = json.loads(last_error_body.decode('utf-8'))
                            error_msg = error_json.get('error', {}).get('message', '')
                        except Exception:
                            error_msg = str(e)
                        
                        # Check if error is rate limit (429), server overloaded (503) or contains high demand message
                        is_transient = (last_error_code in [429, 503]) or ("high demand" in error_msg.lower()) or ("quota" in error_msg.lower())
                        
                        if is_transient and attempt == 0:
                            # Sleep 1 second before retrying this model
                            time.sleep(1)
                            continue
                        else:
                            # Move to next fallback model
                            break
                    except Exception as e:
                        last_error_code = 500
                        last_error_body = json.dumps({
                            'error': {
                                'message': f'Gemini API 통신 실패 ({model}): {str(e)}'
                            }
                        }, ensure_ascii=False).encode('utf-8')
                        break
                
                if success:
                    break
            
            if not success:
                self.send_response(last_error_code)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(last_error_body)
        else:
            self.send_response(404)
            self.end_headers()

# Allow address reuse to avoid "Address already in use" errors during quick restarts
socketserver.TCPServer.allow_reuse_address = True

with socketserver.TCPServer(("", PORT), ProxyHTTPRequestHandler) as httpd:
    print(f"Server running at http://localhost:{PORT}")
    print("Serving static files and proxying API requests...")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server...")
