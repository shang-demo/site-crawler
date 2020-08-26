#!/usr/bin/env bash

source util.sh

function baseBuild() {
  local nodeEnv=${1}
  local envDockerDir=${2}
  local buildDir=${3}

  npm run build
  echo "copy package.json"

  cat package.json | jq ".scripts.start=\"NODE_ENV=${nodeEnv} pm2-docker start .\/index.js --raw\" | .devDependencies={}" > ${buildDir}/package.json

  _generateLog ${buildDir}
  _dockerConfig ${nodeEnv} ${envDockerDir}
}

if [ -z "$*" ]
then
  $*
fi