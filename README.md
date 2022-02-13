# Blog Builder

## Operating Manual

Build with lerna

```none
lerna bootstrap
lerna run build
```

Then build example styles in `./public/styles/`

```none
node-sass -r -o ./css ./public/styles/

// once the blog has been built
cp ./public/styles ./output
```

## Usage Examples

build everything.

By default, if no file is passed in with `--file` or `-f` flag,
then the whole blog will be built from the blog root in `config.json`.

```none
example \
  --templates="./templates/" \
  --styles="./public/styles/css" \
  --config="./config.json" \
  --output="./output" \
  --protocol="http" \
  --baseUrl="localhost:8080" \
  --sourceBaseUrl="https://github.com/rolandwarburton/knowledge" \
```

Build one file.

```none
example \
  --templates="./templates/" \
  --styles="./public/styles/css" \
  --config="./config.json" \
  --output="./output" \
  --protocol="http" \
  --baseUrl="localhost:8080" \
  --sourceBaseUrl="https://github.com/rolandwarburton/knowledge" \
  --file="../knowledge/Linux/borg.md
```

## Config File Example

```json

{
  "version": 0.1,
  "root": "/home/roland/Documents/projects/blogv2/knowledge",
  "virtualPageMeta": [
    {
      "template": "home.hbs",
      "pathOnDisk": "/home/roland/Documents/projects/blogv2/knowledge/index.md",
      "virtual": true
    },
    {
      "template": "about.hbs",
      "pathOnDisk": "/home/roland/Documents/projects/blogv2/knowledge/about.md",
      "virtual": true
    }
  ],
  "pageMeta": [
    {
      "template": "blogPost.hbs",
      "pathOnDisk": "/home/roland/Documents/projects/blogv2/knowledge/Linux/xfce install notes.md",
      "virtual": false,
      "build": true
    }
  ]
}
```

## Publishing

```none
npm login --scope=@rolandwarburton --registry=https://npm.pkg.github.com
// use your github PAT (token) as the password

lerna publish --registry=https://npm.pkg.github.com/
```
