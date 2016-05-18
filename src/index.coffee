AmpersandView = require 'ampersand-view'

data = require './data'

AppView = AmpersandView.extend
  events:
    'click [data-hook=extract]': 'extract'
  extract: ->
    sentence = @queryByHook('sentence').value
    if not sentence then return
    result = {}
    console.time 'extract_words'
    for {dimension, words}  in data
      result[dimension] = words.filter((word) -> sentence.indexOf(word) > -1)
    console.timeEnd 'extract_words'
    @queryByHook('result-full-match').innerText = JSON.stringify(result, null, 2)
    result = {}
    console.time 'extract_words 2'
    for {dimension, words}  in data
      result[dimension] = []
      for word in words
        index = sentence.indexOf(word)
        if index > -1
          result[dimension].push word
          sentence = sentence[...index] + sentence[(index + word.length)...]
    console.timeEnd 'extract_words 2'
    @queryByHook('result-reduce').innerText = JSON.stringify(result, null, 2)
    require 'string_score'
    sentence = @queryByHook('sentence').value
    result = {}
    console.time 'extract_words 3'
    for {dimension, words}  in data
      result[dimension] = words.filter((word) -> sentence.score word)
    console.timeEnd 'extract_words 3'
    @queryByHook('result-score').innerText = JSON.stringify(result, null, 2)


view = new AppView
  el:document.getElementById 'app'
