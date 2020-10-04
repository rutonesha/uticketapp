
  (function() {
    'use strict';
    window.addEventListener('load', function() {
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      var forms = document.getElementsByClassName('needs-validation');
      // Loop over them and prevent submission
      var validation = Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('submit', function(event) {
          if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
          }
          form.classList.add('was-validated');
        }, false);
      });
    }, false);
  })();
// ==============================================================================================
  function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
  
        reader.onload = function (e) {
            $('#imageResult')
                .attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
  }
  
  (function () {
    $('#upload').on('change', function () {
        document.getElementById('infoArea') = " "
        readURL(input);
    });
  });

//   function customise() {
//       var custo = document.getElementById('ticketsize').value;

//       if (custo == 'customise') {
//         document.getElementById('customisediv').style.visibility = true;
        
//       }
//   }


  // =======================================================

  window.addEventListener('load', function() {
      var lastSymbol, lastBarText, lastAltText, lastOptions, lastRotate, lastScaleX, lastScaleY;
      try {
          lastSymbol    = localStorage.getItem('bwipjsLastSymbol');
          lastBarText    = localStorage.getItem('bwipjsLastBarText');
          lastAltText    = localStorage.getItem('bwipjsLastAltText');
          lastOptions = localStorage.getItem('bwipjsLastOptions');
          lastRotate    = localStorage.getItem('bwipjsLastRotate');
          lastScaleX  = +localStorage.getItem('bwipjsLastScaleX');
          lastScaleY  = +localStorage.getItem('bwipjsLastScaleY');
      } catch (e) {
      }
  
      // Set up the select list of barcode types
      var sel = document.getElementById('symbol');
      var opts = [];
      for (var id in symdesc) {
          opts.push(symdesc[id]);
      }
      opts.sort(function (a,b) { return a.desc < b.desc ? -1 : 1 });
      for (var i = 0, l = opts.length; i < l; i++) {
          var elt = document.createElement('option');
          elt.textContent = opts[i].desc;
          elt.value = opts[i].sym;
          sel.appendChild(elt);
      }
  
      sel.addEventListener('change', function(ev) {
              var desc = symdesc[sel.value];
              if (desc) {
                  document.getElementById('symtext').value = desc.text;
                  document.getElementById('symopts').value = desc.opts;
              } else {
                  document.getElementById('symtext').value = '';
                  document.getElementById('symopts').value = '';
              }
              document.getElementById('symaltx').value = '';
              var canvas = document.getElementById('canvas');
              canvas.width = canvas.width;
          });
  
      if (lastSymbol) {
          sel.value = lastSymbol;
      } else {
          sel.selectedIndex = 0;
      }
      var evt = document.createEvent("HTMLEvents");
      evt.initEvent("change", false, true);
      sel.dispatchEvent(evt);
  
      if (lastBarText) {
          document.getElementById('symtext').value = lastBarText;
          document.getElementById('symaltx').value = lastAltText;
          document.getElementById('symopts').value = lastOptions;
      }
      if (lastScaleX && lastScaleY) {
          document.getElementById('scaleX').value = lastScaleX;
          document.getElementById('scaleY').value = lastScaleY;
      }
      if (lastRotate) {
          document.getElementById('rotate' + lastRotate).checked = true;
      }
  
      document.getElementById('scaleX').addEventListener('change', function(ev) {
              document.getElementById('scaleY').value = ev.target.value;
          });
      document.getElementById('scaleX').addEventListener('click', function(ev) {
              document.getElementById('scaleY').value = ev.target.value;
          });
      document.getElementById('render').addEventListener('click', render);
  
      // Allow Enter to render
      document.getElementById('params').addEventListener('keypress', function(ev) {
          if (ev.which == 13) {
              render();
              ev.stopPropagation();
              ev.preventDefault();
              return false;
          }
      });
  
      document.getElementById('versions').textContent =
                  'bwip-js ' + bwipjs.VERSION + ' / BWIPP ' + bwipjs.BWIPP.VERSION;
  });
  
  function render() {
      var elt  = symdesc[document.getElementById('symbol').value];
      var text = document.getElementById('symtext').value.trim();
      var alttext = document.getElementById('symaltx').value.trim();
      var options = document.getElementById('symopts').value.trim();
      var rotate  = document.querySelector('input[name="rotate"]:checked').value;
  
      var scaleX = +document.getElementById('scaleX').value || 1;
      var scaleY = +document.getElementById('scaleY').value || 1;
  
      try {
          localStorage.setItem('bwipjsLastSymbol',  elt.sym);
          localStorage.setItem('bwipjsLastBarText', text);
          localStorage.setItem('bwipjsLastAltText', alttext);
          localStorage.setItem('bwipjsLastOptions', options);
          localStorage.setItem('bwipjsLastScaleX', scaleX);
          localStorage.setItem('bwipjsLastScaleY', scaleY);
          localStorage.setItem('bwipjsLastRotate', rotate);
      } catch (e) {
      }
  
      // Clear the page
      document.getElementById('output').textContent = '';
  
      var canvas = document.getElementById('canvas');
      canvas.height = 1;
      canvas.width  = 1;
      canvas.style.visibility = 'hidden';
  
      // Convert the options to an object.
      let opts = {};
      let aopts = options.split(' ');
      for (let i = 0; i < aopts.length; i++) {
          if (!aopts[i]) {
              continue;
          }
          var eq = aopts[i].indexOf('=');
          if (eq == -1) {
              opts[aopts[i]] = true;
          } else {
              opts[aopts[i].substr(0, eq)] = aopts[i].substr(eq+1);
          }
      }
  
      // Finish up the options object.
      opts.text = text;
      opts.bcid = elt.sym;
      opts.scaleX = scaleX;
      opts.scaleY = scaleY;
      opts.rotate = rotate;
      if (alttext) {
          opts.alttext = alttext;
      }
  
      // Draw the bar code to the canvas using a custom drawing interface.
      try {
          // fixupOptions() modifies options values (currently padding and
          // background color) to provide a simplified interface for the
          // drawing code.
          bwipjs.fixupOptions(opts);
          bwipjs.render(opts, DrawingExample(opts, canvas));
  
          canvas.style.visibility = 'visible';
      } catch (e) {
          // Watch for BWIPP generated raiseerror's.
          var msg = (''+e).trim();
          if (msg.indexOf("bwipp.") >= 0) {
              document.getElementById('output').textContent = msg;
          } else if (e.stack) {
              // GC includes the message in the stack.  FF does not.
              document.getElementById('output').textContent = 
                      (e.stack.indexOf(msg) == -1 ? msg + '\n' : '') + e.stack;
          } else {
              document.getElementById('output').textContent = msg;
          }
      }
  }
//=================================================================
// filename displaying
// ===============================================================
var input = document.getElementById( 'pic' );
var infoArea = document.getElementById( 'infoArea' );

input.addEventListener( 'input', showFileName );

function showFileName( event ) {
var input = event.srcElement;
var fileName = input.files[0].name;
infoArea.textContent = 'Artwork picture : ' + fileName;
}
// =======================================================================
// find our elements
var elements = document.getElementsByClassName('ball'),
	labelsX = document.getElementsByClassName('coords-x'),
	labelsY = document.getElementsByClassName('coords-y');
	container = document.getElementById('container');
// loop over the 3 balls...
for (var n = elements.length; n--;) {

	// ... augment our default options with individual `onDrag` handlers
	var opts = {
		limit: container,
		onDrag: onDragFactory(n),
		setCursor: true
	};

	// ... and initialize drag for each
	window.d = new Draggable(elements[n], opts);

}

// bind `n` to its value at iteration time
function onDragFactory (n) {

	return function (element, x, y) {
		labelsX[n].innerHTML = x;
		labelsY[n].innerHTML = y;
	}

}

// -------------------------------------------------------------------------------------
