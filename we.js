/**
 * Created with JetBrains WebStorm.
 * User: Jack Zhang
 * Date: 12/17/13
 * Time: 15:23
 * Desc: tc_common
 * test case common modules
 */

//launch arguments
var options = {debug: false};

///////////////////////////////////////////////

//override the browser.sleep()
var sleep = function(time) {
  if (options.debug) {
    browser.sleep(time);
    console.log('=================sleep:', time);
  }
}

var dogsleep = function(time) {
  var DEFAULT_DOGSLEEPTIME = 1000;
  var sleepTime = DEFAULT_DOGSLEEPTIME;
  if (time) {
    sleepTime = time;
  }
  browser.sleep(sleepTime);
  console.log('=================dogsleep:', sleepTime);
}


//execute the script in browser
var executeScriptInBrowser = function(func) {
  browser.executeScript(function() {
    return  func;
  }());
}

//random switch ,click the position at last
var randomSwitch = function(position, tabs) {
  var MAX_SWITCH_COUNT = 5;

  var count = 2 + Math.ceil(Math.random() * MAX_SWITCH_COUNT);
  for (var i = 0; i < count; i++) {
    var randomTab = Math.floor(Math.random() * tabs.length)
    tabs[randomTab].click();
  }
  tabs[position].click();
  dogsleep();
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//common wait animation

var waitAnimation = function(value, log) {
  return browser.driver.wait(function() {
    return browser.findElements(by.css('.mask-loading'))
      .then(function(element) {
        var rs = element.length > 0;

        if (rs) {
          rs = element[0].getCssValue('display').then(function(display) {
            if (log) {
              console.log('animation ', value, '---', display)
            }
            return display === value;
          });
        }

        return rs;
      })
  })
    .then(function() {

//      browser.driver.wait(function () {
//        var animation = element(by.css('.mask-loading'));
//        return  animation.getCssValue('display').then(function (display) {
//          if (log) {
//            console.log('animation ', value, '---', display)
//          }
//          return display === value;
//        });
//
//      })


    })


};

var waitURL = function(urlRegexp, log) {
  return browser.driver.wait(function() {
    return browser.driver.getCurrentUrl().then(function(url) {
      if (log) {
        console.log('waiting for url====', url)
      }
      return urlRegexp.test(url);
    });
  });
};

var waitElementByCSS = function(className, log) {
  return browser.driver.wait(function() {
    return browser.findElements(by.css(className))
      .then(function(element) {
        if (log) {
          console.log('waiting for className :', className, '...', element.length)
        }
        return  element.length > 0;
      });
  }).then(function() {
      return  browser.findElement(by.css(className));
    })
};

var waitElementsByCSS = function(className, log) {
  return browser.driver.wait(function() {
    return browser.findElements(by.css(className))
      .then(function(element) {
        if (log) {
          console.log('waiting for className :', className, '...', element.length)
        }
        return  element.length > 0;
      });
  }).then(function() {
      return  browser.findElements(by.css(className));
    })
};

var waitElementBy = function(inBy, log) {
  return browser.driver.wait(function() {
    return browser.findElements(inBy)
      .then(function(element) {
        if (log) {
          console.log('waiting for By ...', element.length)
        }
        return  element.length > 0;
      });
  }).then(function() {
      return  browser.findElements(inBy);
    })
};

var waitListLengthBy = function(inBy, listLength, log) {
//  console.log('waiting for length=' + listLength)

  return browser.driver.wait(function() {
    return browser.findElements(inBy)
      .then(function(element) {
        if (log) {
//          console.log('...', element.length)
        }
        return  element.length === listLength;
      });
  }).then(function() {
      return  browser.findElements(inBy);
    })
};

var waitOneRowStatusBy = function(inBy, waitStatus, log) {
  return browser.driver.wait(function() {
    return browser.findElements(inBy)
      .then(function(element) {
        if (log) {
          console.log('waiting for By ...', element.length)
        }
        var rs = element.length > 0;

        if (rs) {
          rs = element[0].findElement(by.css('.status_label'))
            .getText()
            .then(function(statusText) {
              if (log) {
                console.log('wait status:', waitStatus, ',current status:', statusText)
              }
              return statusText === waitStatus;
            });
        }

        return rs;
      });
  }).then(function() {
      return  browser.findElements(inBy);
    })
};

var waitAllRowsStatusBy = function(inBy, waitStatus, log) {
//  return browser.driver.wait(function () {
//    return browser.findElements(inBy)
//      .then(function (element) {
//        if (log) {
//          console.log('waiting for By ...', element.length)
//        }
//        var rs = element.length > 0;
//
//        if (rs) {
//          rs = element[0].findElement(by.css('.status_label'))
//            .getText()
//            .then(function (statusText) {
//              if (log) {
//                console.log('wait status:', waitStatus, ',current status:', statusText)
//              }
//              return statusText === waitStatus;
//            });
//        }
//        return rs;
//      });
//  }).then(function () {
//      return  browser.findElements(inBy);
//    })
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var validateGridHeader = function(header, log) {

  dogsleep()
  return waitElementBy(by.repeater('column in gridHeader'))
    .then(function(gridHeader) {
      if (log) {
        console.log('======validate gridHeader ', header)
      }
      for (var i = 0; i < header.length; i++) {

        expect(gridHeader[i].getText()).toMatch(header[i]);
      }

      return   gridHeader;
    });

}

// isIgnoreLength ==true will not validate the length of the list
var validateGridDataFristRow = function(vData, isIgnoreLength, log) {

  return waitElementBy(by.repeater('row in gridRow'))
    .then(function(griddata) {
      if (log) {
        console.log('======validate gridData ', vData)
      }
      if (isIgnoreLength) {
        expect(griddata.length).toNotEqual(vData.length);
      }

      for (var property in vData[0]) {
        var firstRow = griddata[0].findElement(by.css('.' + property + ' .cell_content'));
        expect(firstRow.getText()).toEqual(vData[0][property]);
      }

    });

}

var validateGridDataAllRows = function(vData, log) {

  return  waitListLengthBy(by.repeater('row in gridData'), vData.length)
    .then(function(griddata) {
      if (log) {
        console.log('======validate gridData ', vData)
      }

      for (var rIndex = 0; rIndex < vData.length; rIndex++) {
        var row = vData[rIndex];

        for (var property in vData[rIndex]) {

          var firstRow = griddata[rIndex].findElement(by.css('.' + property + ' .cell_content'));
          expect(firstRow.getText()).toMatch(row[property]);
        }
      }


    });

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var we = function(options) {
  options = options;

  return {
    sleep: sleep,
    executeScriptInBrowser: executeScriptInBrowser,
    randomSwitch: randomSwitch,

    waitAnimation: waitAnimation,
    waitElementByCSS: waitElementByCSS,
    waitElementsByCSS: waitElementsByCSS,
    waitElementBy: waitElementBy,
    waitListLengthBy: waitListLengthBy,
    waitURL: waitURL,
    waitOneRowStatusBy: waitOneRowStatusBy,
//    waitAllRowsStatusBy: waitAllRowsStatusBy,

    validateGridHeader: validateGridHeader,
    validateGridDataFristRow: validateGridDataFristRow,
    validateGridDataAllRows: validateGridDataAllRows

  }
}

exports.we = we;