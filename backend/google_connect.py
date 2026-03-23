from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

SCOPES = [
    "https://www.googleapis.com/auth/drive.metadata.readonly",
    "https://www.googleapis.com/auth/spreadsheets"
]

def main():
    # 1. Crear el flujo OAuth usando credentials.json
    flow = InstalledAppFlow.from_client_secrets_file(
        "credentials.json", SCOPES
    )

    # 2. Abrir navegador automáticamente para login
    creds = flow.run_local_server(port=0)

    # 3. Crear servicio de Drive para probar
    service = build("drive", "v3", credentials=creds)

    # 4. Listar los primeros 10 archivos en Drive (prueba)
    results = service.files().list(pageSize=10).execute()

    print("✔ CONEXIÓN EXITOSA A GOOGLE DRIVE ✔")
    print("Archivos encontrados:")
    for file in results.get("files", []):
        print(f"- {file['name']} ({file['id']})")

if __name__ == "__main__":
    main()