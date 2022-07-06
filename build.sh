#!/bin/bash

OPTIND=1

pwd=$(dirname $(readlink -f $0))
src=$pwd/src
dst=$pwd/public

source $pwd/.env


help () {
  echo
  echo "usage: ./$0 [-b] [-f FONT] [-h] [-l] [-t THEME]"
  echo
  echo "options:"
  echo "  -b, --build     build static website"
  echo "  -f, --font      select font"
  echo "  -h, --help      show this help message"
  echo "  -l, --list      list fonts and themes"
  echo "  -t, --theme     select theme"
  echo
  exit 1
}

list_fonts () {
  echo "Available fonts: "
  for font in $src/static/font/*.ttf; do
    echo "- $font" | sed 's|\.ttf||; s|/.*/||'
  done
}

list_themes () {
  echo "Available themes: "
  for theme in $src/themes/*.json; do
    echo "- $theme" | sed 's|\.json||; s|/.*/||'
  done
}

error () {
  echo "$0: $*" >&2
  exit 2
}

check_argument () {
  if [ -z "$OPTARG" ]; then
    error "Missing an argument for --$OPT option!"
  fi
}

theme_update () {
  theme=$(grep -E '"base.*$' $src/themes/$THEME.json | sed 's|^ *"|THEME_|; s|": "|=|; s|".*$||' | tr '[:lower:]' '[:upper:]')
  export $theme
}

build () {
  echo "Selected theme: $THEME"
  echo "Selected font: $FONT"

  rm -rf $dst/*
  mkdir -p $dst/{storage,css}
  cp -rf $src/static/* $dst

  cd $src

  for html in *.html; do source $html > $dst/$html; done
  for js in js/*.js; do source $js > $dst/$js; done
  for css in css/*.css; do source $css > $dst/$css; done
  sed -i "s|^<font color='......'>|<font color='$THEME_BASE04'>|" $dst/txt/logs.txt
  echo "Static website is built!"
}


while getopts hlf:t:a:-: OPT; do
  if [ "$OPT" = "-" ]; then
    OPT="${OPTARG%%=*}"
    OPTARG="${OPTARG#$OPT}"
    OPTARG="${OPTARG#=}"
  fi

  case "$OPT" in

    f | font) check_argument
      if [ -f $src/static/font/$OPTARG.ttf ] || [ -z $OPTARG ]; then
        FONT=$OPTARG
      else
        error "font $OPTARG not found"
      fi
      ;;

    t | theme) check_argument
      if [ -f $src/themes/$OPTARG.json ] || [ -z $OPTARG ]; then
        THEME=$OPTARG
        theme_update
      else
        error "theme $OPTARG not found"
      fi
      ;;

    l | list)
      list_fonts
      echo
      list_themes
      exit 1
      ;;

    a | append)
      echo -n 'Appended to log: '
      echo "<font color='$THEME_BASE04'>[$(date '+%Y.%m.%d %H:%M:%S')]</font> $2" | tee -a $src/static/txt/logs.txt
      ;;

    h | help)
      help
      ;;

    ??* )
      error "illegal option -- $OPT"
      ;;

    ? )
      exit 2
      ;;
  esac
done

shift $((OPTIND-1)) && theme_update && build
