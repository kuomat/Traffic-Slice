from dataclasses import dataclass


@dataclass
class AlertSetup:
    alert_name: str
    type: str
    severity: int
