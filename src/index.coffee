AmpersandView = require 'ampersand-view'

data = require './data'

extract_words = (sentence, words) ->
  words.filter((word) -> sentence.indexOf(word) > -1)


AppView = AmpersandView.extend
  events:
    'click [data-hook=extract]': 'extract'
  extract: ->
    sentence = @queryByHook('sentence').value
    if not sentence then return
    result = {}
    for {dimension, words}  in data
      result[dimension] = extract_words sentence, words
    console.log result

view = new AppView
  el:document.getElementById 'app'
