import os
from datetime import datetime

def photo_upload_path(instance, filename):

    # Build a safe filename (timestamp + original name)
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    safe_name = f"{ts}_{filename}"

    # Use the model's own year/month fields
    year = instance.year or "unknown"
    month = f"{instance.month:02d}" if instance.month else "00"

    return os.path.join("photos", str(year), month, safe_name)