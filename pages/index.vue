<template>
  <div class="container">
    <nav class="level header">
      <div class="level-left">
        <div class="level-item">
          <p class="title is-5">
            <strong>LOGO ({{ filterImages.length }})</strong>
          </p>
        </div>
        <div class="level-item">
          <p class="control">
            <input 
              v-model="filter"
              class="input" 
              type="text" 
              placeholder="Find a logo">
          </p>
          <p class="control">
            <button class="button">
              Search
            </button>
          </p>
        </div>
      </div>
    </nav>
    <section class="section">
      <div class="columns is-multiline">
        <div 
          v-for="image in filterImages"
          :key="image.url"
          class="column is-full-mobile is-one-third-tablet is-one-third-desktop is-one-quarter-widescreen is-one-fifth-fullhd">
          <div class="card">
            <div class="card-image">
              <figure 
                v-clipboard:copy="fullpath + image.url" 
                v-clipboard:success="onCopy"
                class="image is-square is-hoverable">
                <img 
                  :src="image.url" 
                  :alt="image.name">
                <div class="hover-container">
                  <div 
                    :class="{'active': copy}" 
                    class="image-text">{{ copyMessage }}</div>
                </div>
              </figure>
            </div>
            <div class="card-content">
              <div class="content">
                <a 
                  v-if="image.version" 
                  :href="'/?filter='+image.version">#{{ image.version }}</a>
                <a 
                  v-if="image.type" 
                  :href="'/?filter='+image.type">#{{ image.type }}</a>
                <a 
                  v-if="image.color.primary" 
                  :href="'/?filter='+image.color.primary">#{{ image.color.primary }}</a>
                <a 
                  v-if="image.color.background" 
                  :href="'/?filter='+image.color.background">#{{ image.color.background }}</a>
                <a 
                  v-if="image.size.width" 
                  :href="'/?filter='+image.size.width">#{{ image.size.width }}W</a>
                <a 
                  v-if="image.size.height" 
                  :href="'/?filter='+image.size.height">#{{ image.size.height }}H</a>
                <a 
                  v-if="image.extension" 
                  :href="'/?filter='+image.extension">#{{ image.extension }}</a> <br>
                <a 
                  :href="image.url" 
                  target="_blank">{{ image.name }}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <footer class="footer has-text-dark">
      <div class="content">
        <h3 class="has-text-dark">This is a website for list all icon and logo for personal use</h3>
        <h5 class="has-text-dark">Everyone can use all of this files as long as you apply with following license</h5>
        <a 
          rel="license" 
          href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img 
            alt="Creative Commons License" 
            style="border-width:0" 
            src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" ></a><br >This work is licensed under a <a 
              rel="license" 
              href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.
        <br>
        <small>As developer (<a href="https://github.com/kamontat">Kamontat Chantrachirathumrong</a>) I feel appreciate for everyone who visit our website, Thank you and be fun</small>
      </div>
    </footer>
  </div>
</template>

<script>
const KCNT_FOLDER = 'static/v2/kcnt'
const KC_FOLDER = 'static/v2/kc'

function getFiles(fs, dir, _files) {
  _files = _files || []
  var files = fs.readdirSync(dir)
  for (var i in files) {
    var name = dir + '/' + files[i]

    if (fs.statSync(name).isDirectory()) {
      getFiles(fs, name, _files)
    } else {
      const arr = name.split('/')
      if (arr.length === 7) {
        const version = arr[1]
        const type = arr[2]
        const style = arr[3]
        const mainColor = arr[4]
        const bgColor = arr[5]

        const filename = arr[6]

        const regex = /(\d+)x(\d+)\.(.+)$/.exec(filename)
        if (regex && regex.length > 3) {
          _files.push({
            version,
            name: '',
            extension: regex[3],
            size: {
              width: regex[1],
              height: regex[2]
            },
            color: {
              primary: mainColor,
              background: bgColor
            },
            type: type,
            style: style,
            url: name.replace('static', '')
          })
        }
      }
    }
  }
  return _files
}

export default {
  async asyncData({ query }) {
    if (process.server) {
      const fs = require('fs')

      const results = getFiles(fs, KCNT_FOLDER)
      results.push(...getFiles(fs, KC_FOLDER))
      return {
        images: results,
        filter: query.filter || '',
        fullpath: process.env.FULLPATH,
        copy: false
      }
    }
  },
  computed: {
    filterImages() {
      const filters = this.filter.split(' ')
      const regex = new RegExp(
        `^${filters.map(f => `(?=.*\\b${f}\\b)`).join('')}.*$`
      )
      return this.images.filter(image => regex.test(image.url))
    },
    copyMessage() {
      return this.copy ? 'copied' : 'click to copy'
    }
  },
  methods: {
    onCopy() {
      this.copy = true

      console.log('on copy')

      setTimeout(() => {
        this.copy = false
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/styles/variable.scss';

.is-hoverable img {
  opacity: 1;
  display: block;
  width: 100%;
  height: auto;
  transition: 0.5s ease;
  backface-visibility: hidden;
}

.is-hoverable:hover img {
  opacity: 0.3;
}

.is-hoverable:hover .hover-container {
  opacity: 1;
}

.hover-container {
  transition: 0.5s ease;
  opacity: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  text-align: center;
}

.image-text {
  background-color: $dark;
  color: $light;
  font-size: 2rem;

  border-radius: $round-a;

  padding: $gap-f-1;
}

.image-text.active {
  background-color: $green;
  color: $dark;
}

.header {
  margin-top: $gap-f-2;
  margin-left: $gap-f-2;
  margin-right: $gap-f-2;
}
</style>

