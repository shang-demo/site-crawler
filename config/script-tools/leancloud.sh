#!/usr/bin/env bash

scriptDir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
projectDir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && cd ../.. && pwd)"

# 载入依赖
cd ${scriptDir}

function sourcePrivateEnv() {
  local privateEnv=$(ls -a |
    grep -E "private-.*\.sh" |
    grep -v "private-env.default.sh")

  declare -a arr=(${privateEnv})

  for word in ${arr[@]}; do
    source ${word}
  done
}

# 先载入私有环境
sourcePrivateEnv

source constants.sh
source util.sh
source build.sh

function build() {
  cd ${projectDir}
  nodeEnv=leancloud
  envDockerDir=${projectDir}/${DockerfilePath}/${nodeEnv}

  baseBuild "${nodeEnv}" "${envDockerDir}" "${buildDir}"

  leancloudEnvDir=${buildDir}/.leancloud
  mkdir -p ${leancloudEnvDir}
  echo "${leancloudAppId}" >${leancloudEnvDir}/current_app_id
  echo "${leancloudGroup}" >${leancloudEnvDir}/current_group
}

function deploy() {
  cd ${projectDir}/${buildDir}
  lean switch --region ${leancloudRegion} --group ${leancloudGroup} ${leancloudAppId}
  lean deploy
}

if [ -z "$*" ]; then
  build
  deploy
else
  $*
fi
