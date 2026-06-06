from http.server import BaseHTTPRequestHandler
import os
import json
import urllib.request
import urllib.error
import time

# In-memory IP request history: { ip: [timestamp1, timestamp2, ...] }
# Note: In-memory state is ephemeral on serverless platforms (per container instance).
ip_request_history = {}
IP_LIMIT_WINDOW = 15 * 60  # 15 minutes
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

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        # We only handle POST requests to /api/analyze
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)

        # Get Client IP (Vercel provides X-Forwarded-For header)
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

        # Read API Key from Vercel Environment Variables
        api_key = os.environ.get('GEMINI_API_KEY', '')

        if not api_key:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({
                'error': {
                    'message': 'Vercel 환경변수 GEMINI_API_KEY가 설정되지 않았습니다.'
                }
            }, ensure_ascii=False).encode('utf-8'))
            return

        # Forward payload to Gemini API
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
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
        except urllib.error.HTTPError as e:
            res_body = e.read()
            self.send_response(e.code)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(res_body)
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({
                'error': {
                    'message': f'Gemini API 통신 실패: {str(e)}'
                }
            }, ensure_ascii=False).encode('utf-8'))
