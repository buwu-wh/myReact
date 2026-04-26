function getBaseUrl() {
  console.log(location.protocol + 'location.protocol' + location.host);
  return `${location.protocol}//${location.host}/myReact/`;
}
export default { getBaseUrl };
