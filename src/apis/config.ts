function getBaseUrl() {
  console.log(location.protocol + 'location.protocol');
  return location.protocol + '//localhost:5173/';
}
export default { getBaseUrl };
