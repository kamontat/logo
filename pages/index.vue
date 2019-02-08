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
              <a :href="image.url">
                <figure class="image is-square">
                  <img 
                    :src="image.url" 
                    :alt="image.name">
                </figure>
              </a>
            </div>
            <div class="card-content">
              <div class="content">
                <a 
                  v-if="image.type" 
                  href="#">#{{ image.type }}</a>
                <a 
                  v-if="image.size" 
                  href="#">#{{ image.size }}</a>
                <a 
                  v-if="image.extension" 
                  href="#">#{{ image.extension }}</a> <br>
                <a 
                  :href="image.url" 
                  target="_blank">{{ image.name }}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
const KCNT_FOLDER = 'static/kcnt'
const KC_FOLDER = 'static/kc'

function getFiles(fs, dir, files_) {
  files_ = files_ || []
  var files = fs.readdirSync(dir)
  for (var i in files) {
    var name = dir + '/' + files[i]
    if (name.includes('.ai')) continue // remove ai file

    if (fs.statSync(name).isDirectory()) {
      getFiles(fs, name, files_)
    } else {
      const s = name.match(/[0-9]+w/)

      files_.push({
        name: name.substring(name.lastIndexOf('/') + 1, name.lastIndexOf('.')),
        extension: name.substring(name.lastIndexOf('.') + 1),
        size: s && s.length > 0 ? s[0] : undefined,
        type: 'kcnt',
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

      const results = getFiles(fs, KCNT_FOLDER)
      results.push(...getFiles(fs, KC_FOLDER))
      return { images: results, filter: query.filter || '' }
    }
  },
  computed: {
    filterImages() {
      const filters = this.filter.split(' ')
      const regex = new RegExp(
        `^${filters.map(f => `(?=.*\\b${f}\\b)`).join('')}.*$`
      )
      return this.images.filter(image => regex.test(image.url))
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/styles/variable.scss';

.header {
  margin-top: $gap-f-2;
  margin-left: $gap-f-2;
  margin-right: $gap-f-2;
}
</style>
