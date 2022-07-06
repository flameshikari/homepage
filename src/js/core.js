cat << EOF
var path = window.location.pathname
var totalGames, workdir, id
var speed = 30, wait = 20

String.prototype.format = function () { // python-like string formating
  var args = arguments
  return this.replace(/\{\{|\}\}|\{(\d+)\}/g, function (curlyBrack, index) {
    return ((curlyBrack == '{{') ? '{' : ((curlyBrack == '}}') ? '}' : args[index]))
  })
}


function scroll () { window.scrollTo(0, document.body.scrollHeight) }


function swap (id, str, html) {
  if (! html) html = false
  if (html) return "<a id=\"{1}\" onclick=\"this.innerHTML = this.innerHTML == '{0}' ? '{1}' : '{0}'\">{1}</a>".format(str, id)
  if (document.querySelector('#' + id).innerText == id) return document.querySelector('#' + id).innerHTML = str
  else return document.querySelector('#' + id).innerText = id }


function cycle(id) {
  array = window[id]
  current = document.querySelector('#' + id).innerHTML
  index = (array.indexOf(current) + 1) % (array.length)
  document.querySelector('#' + id).innerHTML = array[index]
}


function curl (path) {
  var http = null
  http = new XMLHttpRequest()
  http.open('GET', path, false)
  http.send(null)
  return http.responseText.replace(/\n*$/, '') }


function ls (array, color) {
  resultArray = []
  sortedArray = array.sort()
  for (i = 0; i < sortedArray.length; i++) resultArray[i] = '<font color="{1}"><a href="{0}">{0}</a></font>'.format(sortedArray[i], color)
  return resultArray.join('  ') }


function output (str, color) {
  var result; color ? result = '<span><font color="{1}">{0}</font></span>' : result = '<span>{0}</span>'
  document.getElementById(id).insertAdjacentHTML('beforeend', result.format(str, color)) }


function make (path, str) {
  resultArray = []
  fetchedArray = curl(path).split('\n')
  for (i = 0; i <= fetchedArray.length - 1; i++) {
    arrayUnit = fetchedArray[i].split(/\s+\|\s+/g)
    resultArray[i] = str.format(arrayUnit[0], arrayUnit[1], arrayUnit[2], arrayUnit[3], arrayUnit[4])
  }; return resultArray.join('<br>') }


function calculateAge (birthDay, birthMonth, birthYear) {
  date = new Date()
  nowYear = date.getFullYear()
  nowMonth = date.getMonth()
  nowDay = date.getDate()
  age = nowYear - birthYear
  if (nowMonth < (birthMonth - 1)) age--
  if (((birthMonth - 1) == nowMonth) && (nowDay < birthDay)) age--
  return age }

function calculateRoman (num) {
  var lookup = {  M:1000, CM:900, D:500, CD:400,
                  C:100, XC:90, L:50, XL:40,
                  X:10, IX:9, V:5, IV:4, I:1 }
  var roman = '', i
  for (i in lookup) {
    while ( num >= lookup[i] ) {
      roman += i;
      num -= lookup[i];
    }
  }
  return roman;
}

function titleComparator (a, b) {
  var articles = ['a', 'an', 'the']
  var regexp = new RegExp('^(?:(' + articles.join('|') + ') )(.*)\$')
  var replacer = function (\$0, \$1, \$2) { return \$2 + ', ' + \$1 }
  a = a.toLowerCase().replace(regexp, replacer)
  b = b.toLowerCase().replace(regexp, replacer)
  return a === b ? 0 : a < b ? -1 : 1 }


function listGames (path) {
  resultArray = []
  sortedArray = curl(path).split('\n').filter(function(e) { return e }).sort(titleComparator)
  totalGames = sortedArray.length - 1
  for (i = 0; i < sortedArray.length; i++) {
    arrayUnit = sortedArray[i].split(' # ')
    if (arrayUnit[1]) { arrayUnit[1] = '<font color="${THEME_BASE03}"> # {0}</font>'.format(arrayUnit[1]) } else arrayUnit[1] = ''
    resultArray[i] = '— <a target="_blank" href="https://duckduckgo.com/?q={0} game">{1}</a>{2}<br>'.format(sortedArray[i], arrayUnit[0], arrayUnit[1])
  }; return resultArray.join('') }


function listLinks (path) {
  var str = mainStr = secondStr = resultStr = ''
  var fetchedArray = curl(path).split('\n')
  for (i = 0; i < fetchedArray.length; i++) {
    arrayUnit = fetchedArray[i].split(/\s+\|\s+/g)
    if (arrayUnit[2].startsWith('http')) str = '<font color="{1}"><a class="link" id="{0}" target="_blank" href="{2}">{0}</a></font>  '
    else str = '<font color="{1}"><a id="{0}" onclick="{2}">{0}</a></font>  '
    str = str.format(arrayUnit[0], arrayUnit[1], arrayUnit[2])
    if (i < 6) { mainStr += str } else { secondStr += str }
  };
  resultStr = mainStr + "<font color=\"#F7CA88\" class=\"blink\" id=\"moar\" onclick=\"document.getElementById('moar').classList.remove('blink'); document.querySelector('#moar').innerHTML = secondStr; document.getElementById('moar').removeAttribute('onclick');\">[moar]</span>"
  return resultStr }
EOF
