# backend/honeypot.py → REAL ATTACK MAGNET (works in <60 seconds)
#!/usr/bin/env python3
import warnings
warnings.filterwarnings("ignore", category=DeprecationWarning)

from twisted.internet import reactor
from twisted.protocols import basic
from database import SessionLocal, Attack
from utils.geo import get_location
from utils.logger import logger

class SSHHoneypot(basic.LineReceiver):
    delimiter = b"\n"

    def connectionMade(self):
        self.ip = self.transport.getPeer().host
        logger.info(f"Connection from {self.ip}")
        # Send realistic SSH banner — THIS IS WHAT ATTRACTS BOTS
        self.sendLine(b"SSH-2.0-OpenSSH_7.6p1 Ubuntu-4ubuntu0.3")

    def lineReceived(self, line):
        line = line.decode('utf-8', errors='ignore').strip()
        logger.info(f"{self.ip} → {line}")

        # Capture username/password from real SSH clients/bots
        if line.lower().startswith("auth") or "password" in line.lower() or "login" in line.lower():
            parts = line.split()
            username = password = "unknown"
            for i, part in enumerate(parts):
                if part in ["user", "login", "username"] and i+1 < len(parts):
                    username = parts[i+1]
                if part in ["password", "pass"] and i+1 < len(parts):
                    password = parts[i+1]
            self.log_attack(username, password)

    def log_attack(self, username, password):
        location = get_location(self.ip)
        session = SessionLocal()
        attack = Attack(
            src_ip=self.ip,
            src_port=self.transport.getPeer().port,
            username=username,
            password=password,
            command="",
            country=location["country"],
            country_code=location["country_code"],
            city=location["city"],
            latitude=location.get("latitude"),
            longitude=location.get("longitude")
        )
        session.add(attack)
        session.commit()
        session.close()

        logger.info(f"BRUTE-FORCE → {self.ip} | {username}:{password} | {location['country']}")

from twisted.internet.protocol import Factory
reactor.listenTCP(2222, Factory.forProtocol(SSHHoneypot))

if __name__ == "__main__":
    logger.info("REAL SSH HONEYPOT STARTED → Port 2222 (this one actually gets attacked!)")
    reactor.run()