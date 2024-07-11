<template>
  <div class="container">
    <div id="read"></div>
  </div>
</template>

<script setup>
import Epub from "epubjs";

const exampleBoolURL = '/example/13.[武田绫乃].吹响吧！上低音号：仰望你展翅飞翔的背影.epub'
const book = Epub(exampleBoolURL)
console.log(book)
const rendition = book.renderTo("read",{
    width: "100%",
    height: "100%",
})

rendition.display()

</script>

<style scoped>
.container {
  width: 100%;
  height: 100vh;
}
</style>