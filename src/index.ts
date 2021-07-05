// @ts-ignore
import alfy from 'alfy';
import fetch, { RequestInit } from 'node-fetch';
import _, { get, template, templateSettings } from 'lodash';
import removeHTMLTag from './functions/removeHTMLTag';


type Request = { url: string } & RequestInit;

interface OutputConfig {
  title?: string;
  subtitle?: string;
  arg?: string;
  icon?: string;
}


templateSettings.interpolate = /{{([\s\S]+?)}}/g;
templateSettings.imports = {
  ..._,
  removeHTMLTag
};

const query = process.argv[3]
const { url, ...options } = alfy.userConfig.get('request') as Request;
const inputConfig = alfy.userConfig.get('input');

const outputDefaultConfig: OutputConfig = {
  title: '{{title}}',
  subtitle: '{{subtitle}}',
  arg: '{{arg}}',
  icon: '{{icon}}'
};
const outputConfig: OutputConfig = {
  ...outputDefaultConfig,
  ...alfy.userConfig.get('output')
};

(async () => {
  try {
    const result = await fetch(url.replace('{query}', query), options).then(res => res.json())

    const list = get(result, inputConfig, [])
      .map((item: Record<string, any>) => ({
        title: '',
        subtitle: '',
        arg: '',
        icon: '',
        ...item,
      }))

      const output = list.map((item: Record<string, any>) => ({
        title: template(outputConfig.title)(item),
        subtitle: template(outputConfig.subtitle)(item),
        arg: template(outputConfig.arg)(item)
      }))

      alfy.output(output);
  } catch (e) {
    alfy.error(e)
  }

})()



// alfy.output([{
//   title: JSON.stringify(alfy.userConfig.size),
//   subtitle: process.cwd().substr(100),
//   arg: '1'
// }])
