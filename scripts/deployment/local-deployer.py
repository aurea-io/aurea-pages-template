#!/usr/bin/env python3
"""Pull and safely redeploy the Aurea image with Docker Compose."""

import argparse
import fcntl
import os
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path


def run(command, env):
    return subprocess.run(command, check=True, capture_output=True, text=True, env=env)


def load_env_file(path):
    values = {}
    if path.exists():
        for line in path.read_text().splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, value = line.split("=", 1)
                values[key.strip()] = value.strip().strip('"').strip("'")
    return values


def compose(args, env, *parts):
    return run(["docker", "compose", "--env-file", str(args.env_file), "-f", str(args.compose), *parts], env)


def healthcheck(url, timeout):
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        try:
            with urllib.request.urlopen(url, timeout=5) as response:
                if response.status == 200:
                    return True
        except (urllib.error.URLError, OSError, TimeoutError):
            time.sleep(2)
    return False


def deploy(args):
    env = load_env_file(args.env_file)
    env.update(os.environ)
    compose(args, env, "pull", "aurea")
    try:
        compose(args, env, "up", "-d", "aurea")
        if not healthcheck(args.health_url, args.health_timeout):
            raise RuntimeError(f"healthcheck failed: {args.health_url}")
    except (subprocess.CalledProcessError, RuntimeError) as error:
        print(f"Deployment failed: {error}", file=sys.stderr)
        return 1
    print("Aurea deployment healthy")
    return 0


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--compose", type=Path, default=Path("compose.yaml"))
    parser.add_argument("--env-file", type=Path, default=Path("../aurea-data/.env"))
    parser.add_argument("--health-url", default="http://127.0.0.1:4173/health")
    parser.add_argument("--health-timeout", type=int, default=90)
    parser.add_argument("--once", action="store_true")
    parser.add_argument("--interval", type=int, default=0)
    args = parser.parse_args()
    args.compose = args.compose.resolve()
    args.env_file = args.env_file.resolve()
    lock_path = args.env_file.parent / ".deploy.lock"
    lock_path.parent.mkdir(parents=True, exist_ok=True)
    with lock_path.open("w") as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            print("Another deployment is already running.", file=sys.stderr)
            return 2
        while True:
            result = deploy(args)
            if args.once or not args.interval or result:
                return result
            time.sleep(args.interval)


if __name__ == "__main__":
    sys.exit(main())
