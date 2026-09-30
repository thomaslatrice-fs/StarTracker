#!/bin/bash
BASE=http://localhost:8080

if [ "$(curl -s $BASE/galaxies)" != "[]" ]; then
  echo "Server isn't running, or the database isn't empty."
  echo "Stop the server (Ctrl+C), run: rm star-tracker.sqlite"
  echo "Restart with: node server.js, then run this script again."
  exit 1
fi

run() {
  local method=$1 path=$2 data=$3 out body
  if [ -n "$data" ]; then
    echo "\$ curl -X $method $BASE$path \\"
    echo "    -H \"Content-Type: application/json\" \\"
    echo "    -d '$data'"
    out=$(curl -s -X "$method" "$BASE$path" -H "Content-Type: application/json" -d "$data" -w $'\n%{http_code}')
  else
    echo "\$ curl -X $method $BASE$path"
    out=$(curl -s -X "$method" "$BASE$path" -w $'\n%{http_code}')
  fi
  body="${out%$'\n'*}"
  [ -n "$body" ] && echo "$body"
  echo "HTTP ${out##*$'\n'}"
  echo
}

section() {
  read -r -p "Press Enter to start: $1 "
  clear
  echo "===== $1 ====="
  echo
}

section "GALAXIES"
run POST /galaxies '{"name":"Milky Way","size":100000,"description":"Our home galaxy"}'
run POST /galaxies '{"name":"Andromeda","size":220000,"description":"Nearest large galaxy"}'
run GET /galaxies
run GET /galaxies/1
run PUT /galaxies/1 '{"description":"A barred spiral galaxy"}'
run DELETE /galaxies/2
run GET /galaxies

section "STARS"
run POST /stars '{"name":"Sun","size":1392700,"description":"Our star","galaxyId":1}'
run POST /stars '{"name":"Vega","size":2360000,"description":"Bright star in Lyra","galaxyId":1}'
run GET /stars
run GET /stars/1
run PUT /stars/1 '{"description":"The star at the center of our solar system"}'
run DELETE /stars/2
run GET /stars

section "PLANETS"
run POST /planets '{"name":"Earth","size":12742,"description":"Our home planet"}'
run POST /planets '{"name":"Mars","size":6779,"description":"The red planet"}'
run GET /planets
run GET /planets/1
run PUT /planets/1 '{"description":"The third planet from the Sun"}'
run DELETE /planets/2
run GET /planets

section "MANY-TO-MANY: STARS AND PLANETS"
run POST /stars/1/planets '{"planetId":1}'
run POST /stars '{"name":"Kepler-16A","size":903000,"description":"Primary star of a binary system","galaxyId":1}'
run POST /stars '{"name":"Kepler-16B","size":315000,"description":"Companion star","galaxyId":1}'
run POST /planets '{"name":"Kepler-16b","size":107000,"description":"Planet orbiting both stars"}'
run POST /stars/3/planets '{"planetId":3}'
run POST /stars/4/planets '{"planetId":3}'
run GET /planets/3
run DELETE /stars/4/planets/3
run GET /planets/3

section "GALAXY WITH ITS STARS"
run GET /galaxies/1
run GET /galaxies/999
