import { toShaderToyURL } from './misc'

export function bbc2html(content, allowMultimedia) {
  //content = content.replace(new RegExp('\r?\n','g'), '<br />');

  // Prevent JS injection
  content = content.replace(
    /(\[url=)javascript:?(.*?)(\])(.*?)(\[\/url\])/gi,
    '',
  )
  content = content.replace(/(\[url\])javascript:?(.*?)(\[\/url\])/gi, '')
  content = content.replace(/(\[img\])javascript:?(.*?)(\[\/img\])/gi, '')

  // Links
  content = content.replace(
    /(\[url=)(.*?)(\])(.*?)(\[\/url\])/gi,
    (_, __, g2, ___, g4) =>
      `<a href="${toShaderToyURL(
        g2,
      )}" class="regular" target="_blank">${g4}</a>`,
  )
  content = content.replace(
    /(\[url\])(.*?)(\[\/url\])/gi,
    (_, __, g2) =>
      `<a href="${toShaderToyURL(
        g2,
      )}" class="regular" target="_blank">${g2}</a>`,
  )

  // Emoticons
  content = content.replace(
    /(:\))/g,
    '<img src="https://www.shadertoy.com/img/emoticonHappy.png">',
  )
  content = content.replace(
    /(:\()/g,
    '<img src="https://www.shadertoy.com/img/emoticonSad.png">',
  )
  content = content.replace(
    /(:D)/g,
    '<img src="https://www.shadertoy.com/img/emoticonLaugh.png">',
  )
  content = content.replace(
    /(:love:)/gi,
    '<img src="https://www.shadertoy.com/img/emoticonLove.png">',
  )
  content = content.replace(
    /(:octopus:)/gi,
    '<img src="https://www.shadertoy.com/img/emoticonOctopus.png">',
  )
  content = content.replace(
    /(:octopusballoon:)/gi,
    '<img src="https://www.shadertoy.com/img/emoticonOctopusBalloon.png">',
  )

  // Unicode
  content = content.replace(/(:alpha:)/gi, '&#945;')
  content = content.replace(/(:beta:)/gi, '&#946;')
  content = content.replace(/(:delta:)/gi, '&#9169;')
  content = content.replace(/(:epsilon:)/gi, '&#949;')
  content = content.replace(/(:nabla:)/gi, '&#8711;')
  content = content.replace(/(:square:)/gi, '&#178;')
  content = content.replace(/(:sube:)/gi, '&#179;')
  content = content.replace(/(:limit:)/gi, '&#8784;')

  // Text formatting
  content = content.replace(
    /(\[b\])([.\s\S]*?)(\[\/b\])/gi,
    '<strong>$2</strong>',
  )
  content = content.replace(/(\[i\])([.\s\S]*?)(\[\/i\])/gi, '<em>$2</em>')
  content = content.replace(/(\[u\])([.\s\S]*?)(\[\/u\])/gi, '<u>$2</u>')
  content = content.replace(/(\[ul\])([.\s\S]*?)(\[\/ul\])/gi, '<ul>$2</ul>')
  content = content.replace(/(\[li\])([.\s\S]*?)(\[\/li\])/gi, '<li>$2</li>')
  content = content.replace(
    /(\[code\])([.\s\S]*?)(\[\/code\])/gi,
    '<pre>$2</pre>',
  )

  // Multimedia
  if (allowMultimedia) {
    content = content.replace(/(\[img\])(.*?)(\[\/img\])/gi, (_, __, g2) => {
      const url = toShaderToyURL(g2)
      return `<a href="${url}"><img src="${url}" style="max-width:100%;"/></a>`
    })
    content = content.replace(
      /(\[video\])(?:http|https|)(?::\/\/|)(?:www.|)(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/ytscreeningroom\?v=|\/feeds\/api\/videos\/|\/user\S*[^\w\-\s]|\S*[^\w\-\s]))([\w-]{11})(.*?)(\[\/video\])/gi,
      '<iframe width="100%" height="360" src="https://www.youtube.com/embed/$2?hd=1" frameborder="0" allowfullscreen></iframe>',
    )
  }

  return content
}
