title: "关注内容"
author: vampirefan
date: 2012-10-15 23:40
comments: true
category: college
--------------------

又把网站的外观整了下，决定一段时间内在也不理会这个了。一个网站的外表再怎么说也只能是外表，最终决定质量的还是内容。但不能说外表不重要，一眼看上去给人舒适才能让人静下心来读内容。网页还是要简洁点的好。再多的修饰就是浮夸，就像生活中女人给人的印象终究是简单和素颜的好，浓妆总会给人生厌。

<!-- more -->

整网站外观是件很痛苦的事情，产生的效果总是和预想的不同，一个地方达到要求了有时候造成另外的地方的不协调。时间没有完美，只能尽可能的去均衡美好和不协调。加了一个功能，方向键和`J`,`K`可以用来跳转到上一篇或下一篇博文。但是边栏因为`jQuary`不能在`footer`里面正确的以三栏的形式显示了，索性就不显示了。最后还是决定不用`jQuary`了。`js`实现的方向键跳转功能如下：

```js
<script type="text/javascript">
document.addEventListener("keydown", function ( event ) {
      if ( event.keyCode === 9 || ( event.keyCode >= 32 && event.keyCode <= 34 ) || (event.keyCode >= 37 && event.keyCode <= 40) ) {
          event.preventDefault();
      }
  }, false);
  
document.addEventListener("keyup", function ( event ) {
    if ( event.keyCode === 9 || ( event.keyCode >= 32 && event.keyCode <= 34 ) || (event.keyCode >= 37 && event.keyCode <= 40) ) {
        switch( event.keyCode ) {
            case 33: // pg up
            case 37: // left
            case 38: // up
              {% if page.previous %}
                url = '{{ site.url }}{{ page.previous.url }}';
              {% endif %}
                     break;
            case 34: // pg down
            case 39: // right
            case 40: // down
              {% if page.next %}
                url = '{{ site.url }}{{ page.next.url }}';
              {% endif %}
                     break;
        }
        if (url) {
            window.location = url;
        }
        event.preventDefault();
    }
}, false);
</script>
```

有点晚了，早点睡了。挤一挤，时间总会有的。重要的是要提高效率！！

