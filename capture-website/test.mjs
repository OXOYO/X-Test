import captureWebsite from 'capture-website';

const sites = [
  {
    name: 'github',
    url: 'https://github.com/sindresorhus/capture-website',
  },
  {
    name: 'image',
    url: 'https://gips2.baidu.com/it/u=195724436,3554684702&fm=3028&app=3028&f=JPEG&fmt=auto?w=1280&h=960'
  }
];

const run = () => {
  for (const site of sites) {
    captureWebsite.file(site.url, `output/${site.name}_${Date.now()}.png`);
  }
}

run();