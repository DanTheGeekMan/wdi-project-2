module.exports = {
 data: getData
};

const request = require("request-promise");


function getData(req, res) {

  let key = 'AIzaSyD5H0Rx_xq2rUKeMyr5fGyDYVBcJyZIIDg';
  let id  = req.params.id;

  request(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${id}&key=AIzaSyD5H0Rx_xq2rUKeMyr5fGyDYVBcJyZIIDg`).then(data => {
    let json = JSON.parse(data);
    return res.status(200).json({ json });
  });
}
