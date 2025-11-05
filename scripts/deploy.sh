#!/usr/bin/env bash
set -euo pipefail

CONTAINER="symfi-api"
CONTAINER_PORT="${CONTAINER_PORT:-5000}"
ENV_VARS=( "PROXY_DOWNLOAD_ENABLED=true" "USE_API_V2=true" )
HOST_PORT="${HOST_PORT:-5000}"
IMAGE="kttrez/symfi-api:latest"

usage() {
  cat <<EOF
Użycie: $0 [--host-port N] [--container-port N]
Opcje:
  --host-port N       port hosta (domyślnie: 5000)
  --container-port N  port w kontenerze (domyślnie: 5000)
  -h, --help          pokaż ten komunikat

Przykład:
  $0 --host-port 5000 --container-port 5000
EOF
}

# parse arguments
while [ "$#" -gt 0 ]; do
  case "$1" in
    --host-port)
      HOST_PORT="$2"; shift 2;;
    --container-port)
      CONTAINER_PORT="$2"; shift 2;;
    -h|--help)
      usage; exit 0;;
    --) shift; break;;
    *) echo "Nieznana opcja: $1" >&2; usage; exit 2;;
  esac
done

# check docker availability
echo "Sprawdzam dostępność Dockera..."
if ! command -v docker >/dev/null 2>&1; then
  echo "Docker nie jest zainstalowany lub nie dostępny w PATH." >&2
  exit 1
fi

# stop and remove existing container if exists
existing_container=$(docker ps -a --filter "name=^/${CONTAINER}$" -q || true)
if [ -n "${existing_container}" ]; then
  echo "Znaleziono istniejący kontener '${CONTAINER}' (id: ${existing_container}), zatrzymuję..."
  docker stop "${CONTAINER}" || true
  echo "Usuwam kontener '${CONTAINER}'..."
  docker rm "${CONTAINER}" || true
else
  echo "Brak istniejącego kontenera o nazwie '${CONTAINER}'."
fi

# remove existing image if present
existing_image=$(docker images -q "${IMAGE}" || true)
if [ -n "${existing_image}" ]; then
  echo "Znaleziono istniejący obraz '${IMAGE}' (id: ${existing_image}), usuwam..."
  # używamy -f aby usunąć również gdy jest powiązany (wymusi usunięcie)
  docker rmi -f "${IMAGE}" || true
else
  echo "Brak istniejącego obrazu '${IMAGE}'."
fi

# pull latest image
echo "Pobieram najnowszy obraz '${IMAGE}' z Docker Hub..."
docker pull "${IMAGE}"

# run new container
echo "Uruchamiam nowy kontener '${CONTAINER}' z portem ${HOST_PORT}:${CONTAINER_PORT} i zmiennymi środowiskowymi..."
run_args=( -d --name "${CONTAINER}" -p "${HOST_PORT}:${CONTAINER_PORT}" --restart unless-stopped )
for ev in "${ENV_VARS[@]}"; do
  run_args+=( -e "$ev" )
done
run_args+=( "${IMAGE}" )

docker run "${run_args[@]}"

echo "Gotowe. Kontener '${CONTAINER}' powinien działać."
echo "Sprawdź logi : docker logs -f ${CONTAINER}"
