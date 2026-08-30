#!/usr/bin/env bash
set -Eeuo pipefail

service_name="aurea-deployer.service"
project_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)"
data_dir="${AUREA_DATA_DIR:-${project_dir}/../aurea-data}"
if [[ "${data_dir}" != /* ]]; then data_dir="${project_dir}/${data_dir}"; fi
data_dir="$(realpath -m -- "${data_dir}")"
env_file="${data_dir}/.env"
service_target="/etc/systemd/system/${service_name}"
aurea_user="${SUDO_USER:-$(id -un)}"

if [[ "${EUID}" -ne 0 ]]; then
  exec sudo env AUREA_DATA_DIR="${data_dir}" "$0" "$@"
fi
if [[ ! -f "${env_file}" ]]; then
  mkdir -p "${data_dir}"
  install -o "${aurea_user}" -g "$(id -gn "${aurea_user}")" -m 0600 "${project_dir}/deploy/.env.example" "${env_file}"
fi
chown "${aurea_user}:$(id -gn "${aurea_user}")" "${env_file}"
chmod 0600 "${env_file}"
rendered_service="$(mktemp)"
trap 'rm -f -- "${rendered_service}"' EXIT
sed -e "s|@AUREA_DIR@|${project_dir}|g" -e "s|@AUREA_ENV_FILE@|${env_file}|g" -e "s|@AUREA_USER@|${aurea_user}|g" deploy/aurea-deployer.service > "${rendered_service}"
install -o root -g root -m 0644 "${rendered_service}" "${service_target}"
systemctl daemon-reload
systemctl enable --now "${service_name}"
echo "Aurea autodeployer instalado: systemctl status ${service_name}"
