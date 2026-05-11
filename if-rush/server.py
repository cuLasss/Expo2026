from __future__ import annotations

import argparse
import json
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse


ROOT = Path(__file__).resolve().parent.parent
RANKING_PATH = ROOT / "if-rush" / "ranking.json"


def sanitize_name(value):
    clean = "".join(ch for ch in str(value or "").upper() if "A" <= ch <= "Z")
    return (clean[:14] or "ALUNOIF")


def normalize_ranking(payload):
    entries = payload.get("ranking", payload) if isinstance(payload, dict) else payload
    if not isinstance(entries, list):
        return []

    ranking = []
    for entry in entries:
        if not isinstance(entry, dict):
            continue
        try:
            score = max(0, int(float(entry.get("score", 0))))
        except (TypeError, ValueError):
            continue
        ranking.append(
            {
                "name": sanitize_name(entry.get("name")),
                "score": score,
                "time": max(0, int(float(entry.get("time", 0) or 0))),
            }
        )

    ranking.sort(key=lambda item: (-item["score"], -item["time"], item["name"]))
    return ranking[:10]


class IFRushHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_POST(self):
        request_path = unquote(urlparse(self.path).path).replace("\\", "/")
        if request_path != "/if-rush/ranking.json":
            self.send_error(404, "Endpoint nao encontrado")
            return

        try:
            length = int(self.headers.get("Content-Length", "0"))
            payload = json.loads(self.rfile.read(length).decode("utf-8") or "{}")
            ranking = normalize_ranking(payload)
            RANKING_PATH.write_text(json.dumps({"ranking": ranking}, indent=2), encoding="utf-8")
        except Exception as exc:
            self.send_error(400, f"Ranking invalido: {exc}")
            return

        body = json.dumps({"ok": True, "ranking": ranking}).encode("utf-8")
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def main():
    parser = argparse.ArgumentParser(description="Servidor local do IF Rush com ranking em JSON.")
    parser.add_argument("--host", default="localhost")
    parser.add_argument("--port", default=8765, type=int)
    args = parser.parse_args()

    RANKING_PATH.parent.mkdir(parents=True, exist_ok=True)
    if not RANKING_PATH.exists():
        RANKING_PATH.write_text('{\n  "ranking": []\n}\n', encoding="utf-8")

    server = ThreadingHTTPServer((args.host, args.port), IFRushHandler)
    print(f"IF Rush rodando em http://{args.host}:{args.port}/if-rush/")
    print(f"Ranking persistindo em {RANKING_PATH}")
    server.serve_forever()


if __name__ == "__main__":
    main()
