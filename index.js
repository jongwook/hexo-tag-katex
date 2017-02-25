'use strict';

var katex = require('katex'),
  util = require('hexo-util');

/**
* {% katex [displayMode=true] %}
*/
hexo.extend.tag.register('katex', function(args, content) {
  var displayMode = (args[0] && args[0]!== "true") ? false : true;
  return katex.renderToString(content, {
    displayMode: displayMode
  });
}, {ends: true});

/*
* prepend link to Khan Academy CSS
*/
hexo.extend.filter.register('after_post_render', function(data) {

  hexo.log.info("rendering KaTex");

  function unescapeHtml(html) {
    var regex = {
      '&': /&amp;/g,
      '<': /&lt;/g,
      '>': /&gt;/g,
      '"': /&quot;/g,
      "'": /&#039;/g,
      " ": /&nbsp;/g
    };
    for (var key in regex) {
      html = html.replace(regex[key], key);
    }
    return html;
}

  // display mode: \[ and \]
  data.content = data.content.replace(/\[<br>([^\$\n]+)<br>\]/g, function(matched, group) {
    hexo.log.info("Compiling : " + group);
    return katex.renderToString(unescapeHtml(group), { displayMode: true });
  });

  // display mode: double dollars
  data.content = data.content.replace(/\$\$([^\$\n]+)\$\$/g, function(matched, group) {
    hexo.log.info("Compiling : " + group);
    return katex.renderToString(unescapeHtml(group), { displayMode: true });
  });

  // inline mode: single dollars
  data.content = data.content.replace(/\$([^\$\n]+)\$/g, function(matched, group) {
    hexo.log.info("Compiling : " + group);
    return katex.renderToString(unescapeHtml(group), { displayMode: false });
  });

  data.content = util.htmlTag('link',{
    rel: 'stylesheet',
    type: 'text/css',
    href: 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css'
  }) + data.content;

  return data;
});
