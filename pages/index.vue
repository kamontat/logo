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
          class="column is-half-mobile is-one-third-tablet is-one-third-desktop is-one-quarter-widescreen is-one-fifth-fullhd">
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
                  v-if="image.type" 
                  :href="'/?filter='+image.type">#{{ image.type }}</a>
                <a 
                  v-if="image.size" 
                  :href="'/?filter='+image.size">#{{ image.size }}</a>
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
const KCNT_FOLDER = 'static/kcnt'
const KC_FOLDER = 'static/kc'

function getFiles(fs, dir, type, files_) {
  files_ = files_ || []
  var files = fs.readdirSync(dir)
  for (var i in files) {
    var name = dir + '/' + files[i]
    if (name.includes('.ai')) continue // remove ai file

    if (fs.statSync(name).isDirectory()) {
      getFiles(fs, name, type, files_)
    } else {
      const s = name.match(/[0-9]+w/)

      files_.push({
        name: name.substring(name.lastIndexOf('/') + 1, name.lastIndexOf('.')),
        extension: name.substring(name.lastIndexOf('.') + 1),
        size: s && s.length > 0 ? s[0] : undefined,
        type: type,
        url: name.replace('static', '')
      })
    }
  }
  return files_
}

export default {
  async asyncData({ query }) {
    if (process.server) {
      const fs = require('fs')

      const results = getFiles(fs, KCNT_FOLDER, 'kcnt')
      results.push(...getFiles(fs, KC_FOLDER, 'kc'))
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
