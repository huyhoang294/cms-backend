const router = require("express").Router();
const Cabinet = require("../../models/cabinet");
const User = require("../../models/user");
const Station = require("../../models/station");
const Open_log = require("../../models/open_log");
const Payment = require("../../models/payment");
const moment = require("moment");

router.get("/", (req, res) => {
  let result = {
    cabinet: {},
    user: {},
    station: {},
    profit: {},
  };

  Cabinet.find((err, cabinets) => {
    var activeCabinets = [];
    var stateCabinets = [];

    if (err) {
      console.log("Error: " + err);
    } else {
      result.cabinet.total = cabinets.length;
      for (let i = 0; i < cabinets.length; i++) {
        if (cabinets[i].active == 1) {
          activeCabinets.push(cabinets[i]);
        }
        if (cabinets[i].state == 1) {
          stateCabinets.push(cabinets[i]);
        }
      }
      result.cabinet.active = activeCabinets.length;
      result.cabinet.used = stateCabinets.length;
      User.find((err, users) => {
        var activeUsers = [];
        var stateUsers = [];
        if (err) {
          console.log("Error: " + err);
        } else {
          result.user.total = users.length;
          for (let i = 0; i < users.length; i++) {
            if (users[i].active == 1) {
              activeUsers.push(users[i]);
            }
            if (users[i].online == 1) {
              stateUsers.push(users[i]);
            }
          }
          result.user.active = activeUsers.length;
          result.user.online = stateUsers.length;
          Station.find((err, stations) => {
            var activeStations = [];
            var stationlist = [];
            if (err) {
              console.log("Error: " + err);
            } else {
              result.station.total = stations.length;
              for (let i = 0; i < stations.length; i++) {
                // stationlist.push({
                //   placeName: stations[i].placename,
                //   location: stations[i].location,
                //   stationId: stations[i]._id,
                // });
                if (stations[i].active) {
                  activeStations.push(stations[i]);
                }
              }
              result.station.active = activeStations.length;
              // result.station.listStation = stationlist;
              Payment.find((err, payments) => {
                var total = 0;
                if (err) {
                  console.log("Error: " + err);
                } else {
                  for (let i = 0; i < payments.length; i++) {
                    if (payments[i].cost) {
                      total += payments[i].cost*1;
                    }
                  }
                  result.profit.total = total;
                  res.json(result);
                }
              });
            }
          });
        }
      });
    }
  });
});

router.get("/listener", (req, res) => {
  let userListen = User.watch();
  let cabinetListen = Cabinet.watch();
  let stationListen = Station.watch();
  let paymentListen = Payment.watch();
  let flag = false;
  userListen.on("change", (response) => {
    flag = true;
    userListen.close();
  });
  cabinetListen.on("change", (response) => {
    flag = true;
    cabinetListen.close();
  });
  stationListen.on("change", (response) => {
    flag = true;
    stationListen.close();
  });
  paymentListen.on("change", (response) => {
    flag = true;
    paymentListen.close();
  });
  res.setTimeout(3000, () => {
    if (!flag) {
      res.json(false);
      userListen.close();
      cabinetListen.close();
      stationListen.close();
      paymentListen.close();
    } else {
      userListen.close();
      cabinetListen.close();
      stationListen.close();
      paymentListen.close();
      res.json(true);
    }
  });
});

router.get("/station", (req, res) => {
  let result = {
    data: {},
  };
  Station.find()
    .populate("price_id")
    .exec((err, stations) => {
      if (err) {
        console.log("Error: " + err);
      } else {
        result.total = stations.length;
        result.data = stations;
      }
      res.json(result);
    });
});

function simplifyName(name) {
  var words = name.split(" ");
  var result = "";
  for (var i = 0; i < words.length; i++) {
    result += words[i].substring(0, 1).toUpperCase();
  }
  return result;
}

function simplifySubName(name) {
  var words = name.split(" ");
  var result = "";
  for (var i = 0; i < words.length; i++) {
    result += words[i].substring(0, 2).toUpperCase();
  }
  return result;
}

router.get("/chart", (req, res) => {
  var findStations = new Promise((resolve, reject) => {
    Station.find((err, stations) => {
      if (err) {
        reject(Error("Error: " + err));
      } else {
        resolve(stations);
      }
    });
  });
  findStations.then((stations) => {
    var countOpen = new Promise((resolve, reject) => {
      let result = [];
      for (var i = 0; i < stations.length; i++) {
        result.push(
          new Promise((resolve, reject) => {
            var stationName =
              simplifyName(stations[i].placename) +
              "-" +
              simplifySubName(stations[i].location) +
              "-" +
              stations[i].no;
            Open_log.find({ station_id: stations[i]._id }, (err, logs) => {
              resolve({
                argument: stationName,
                value: logs.length,
              });
            });
          })
        );
      }
      Promise.all(result).then((values) => {
        res.json(values);
      });
    });
  });
});

// router.get("/chart", (req, res) => {
//   let result = {
//     zero: 0,
//     one: 0,
//     two: 0,
//     three: 0,
//     four: 0,
//     five: 0,
//     six: 0,
//     seven: 0,
//     eight: 0,
//     nine: 0,
//     ten: 0,
//     eleven: 0,
//     twelve: 0,
//     thirdteen: 0,
//     fourteen: 0,
//     fifteen: 0,
//     sixteen: 0,
//     seventeen: 0,
//     eighteen: 0,
//     nineteen: 0,
//     twenty: 0,
//     twentyOne: 0,
//     twentyTwo: 0,
//     twentythree: 0,
//   };

//   const beginOfDate = moment().startOf("day").unix(req.query.date);
//   const endOfDate = moment().endOf("day").unix(req.query.date);
// console.log(beginOfDate);
// console.log(beginOfDate);
//   const stationId = req.query.stationId;
//   Open_log.find({ station_id: stationId }, (err, logs) => {
//     if (err) {
//       console.log("Error: " + err);
//     } else {
//       for (var i; i < logs.length; i++) {
//         if (
//           moment(logs[i].open_time).unix() > beginOfDate &&
//           moment(logs[i].open_time).unix() < endOfDate
//         ) {
//           if (moment(logs[i].open_time).get("hour") == 0) {
//             result.zero = result.zero + 1;
//           }

//           if (moment(logs[i].open_time).get("hour") == 1) {
//             result.one = result.one + 1;
//           }

//           if (moment(logs[i].open_time).get("hour") == 2) {
//             result.two = result.two + 1;
//           }

//           if (moment(logs[i].open_time).get("hour") == 3) {
//             result.three = result.three + 1;
//           }

//           if (moment(logs[i].open_time).get("hour") == 4) {
//             result.four = result.four + 1;
//           }

//           if (moment(logs[i].open_time).get("hour") == 5) {
//             result.five = result.five + 1;
//           }

//           if (moment(logs[i].open_time).get("hour") == 6) {
//             result.six = result.six + 1;
//           }

//           if (moment(logs[i].open_time).get("hour") == 7) {
//             result.seven = result.seven + 1;
//           }

//           if (moment(logs[i].open_time).get("hour") == 8) {
//             result.eight = result.eight + 1;
//           }

//           if (moment(logs[i].open_time).get("hour") == 9) {
//             result.nine = result.nine + 1;
//           }

//           if (moment(logs[i].open_time).get("hour") == 10) {
//             result.ten = result.ten + 1;
//           }

//           if (moment(logs[i].open_time).get("hour") == 11) {
//             result.eleven = result.eleven + 1;
//           }

//           if (moment(logs[i].open_time).get("hour") == 12) {
//             result.twelve = result.twelve + 1;
//           }

//           if (moment(logs[i].open_time).get("hour") == 13) {
//             result.thirdteen = result.thirdteen + 1;
//           }

//           if (moment(logs[i].open_time).get("hour") == 14) {
//             result.fourteen = result.fourteen + 1;
//           }

//           if (moment(logs[i].open_time).get("hour") == 15) {
//             result.fifteen = result.fifteen + 1;
//           }

//           if (moment(logs[i].open_time).get("hour") == 16) {
//             result.sixteen = result.sixteen + 1;
//           }

//           if (moment(logs[i].open_time).get("hour") == 17) {
//             result.seventeen = result.seventeen + 1;
//           }

//           if (moment(logs[i].open_time).get("hour") == 18) {
//             result.eighteen = result.eighteen + 1;
//           }

//           if (moment(logs[i].open_time).get("hour") == 19) {
//             result.nineteen = result.nineteen + 1;
//           }

//           if (moment(logs[i].open_time).get("hour") == 20) {
//             result.twenty = result.twenty + 1;
//           }

//           if (moment(logs[i].open_time).get("hour") == 21) {
//             result.twentyOne = result.twentyOne + 1;
//           }

//           if (moment(logs[i].open_time).get("hour") == 22) {
//             result.twentyTwo = result.twentyTwo + 1;
//           }

//           if (moment(logs[i].open_time).get("hour") == 23) {
//             result.twentythree = result.twentythree + 1;
//           }
//         }
//       }

//       res.json(result);
//     }
//   });
// });

module.exports = router;
