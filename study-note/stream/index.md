 > fs的readFile在读取完成后会临时存放到内存中，并且toString是有长度限制的，如果是一个巨大的文件，toString调用会抛出异常的。

 > fs的readFile是要在全部的数据都读取完成后再返回给接口调用方，在读取数据的期间，接口都是处于Wait的状态，没有任何数据返回。会有一段时间的TTFB；

> 相对于fs读取文件，使用stream更靠谱，读一点，写一点；读取大文件的过程中，不会一次性的读入到内存中。每次只会读取数据源的一个数据块。然后后续过程中可以立即处理该数据块(数据处理完成后会进入垃圾回收机制)。而不用等待所有的数据加载完再写入。

> 调用fs.createReadStream的时候内部会先调用read()这个内部方法；ReadStream类是继承于Readable接口；read()方法也是Readable提供的；read()会调用_read()方法；_read()是可读流ReadStream自己实现的;_read()的作用就是push；(参考1.jpeg)