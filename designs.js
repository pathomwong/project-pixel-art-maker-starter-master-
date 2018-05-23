
/***
Bug list
* Need to remove duplicate value in memPosition, this will fix overlay color to repaint the first problem.
****/

$(function(){
      let startPosition = {'row': 0,'col': 0};
      let tempPosition = [];
      let memPosition = [];

      //Set Default value for height and width
      let height = 0;
      let width = 0;

      //set init tool
      let tool = 'pen';

      // Select color input
      const colorPicker = document.getElementById("colorPicker");

      //cached variables
      const pen =  $('#pen');
      const sizePicker =   $('#sizePicker');
      const pixelCanvas = $('#pixel_canvas');
      const clearTableButton = $('#clear_table');
      const drawLineButton =   $('#draw_line');
      const drawRectangleButton = $('#draw_rectangle');
      const dropper = $('#dropper');

      pen.css('background-color', '#7F8C8D');

      // Select size input
      sizePicker.submit(function(event){
          event.preventDefault();
          //Clear Table, before redraw the table
          pixelCanvas.empty();
          // When size is submitted by the user, call makeGrid()
          height = $('#input_height').val();
          width = $('#input_width').val();
          makeGrid(height, width);
      });

      //Function
      /**
      * @description  making grid fro user
      * @param {number} height
      * @param {number} width
      * @returns none
      **/
      function makeGrid(height,width) {
          // Your code goes here!
          // Get a reference to the table
          let col = "";
          for(let j = 0; j < width; j++){
             //create column
             col += "<td></td>";
          }

          for(let i = 0; i < height; i++){
            // Insert a row in the table
            pixelCanvas.append("<tr>"+col+"</tr>");
          }
      }

      /**
      * @description  clear the table
      * @param {number} height
      * @param {number} width
      * @returns none
      **/
      function clearTable(height,width){
            $('td').css('background-color', '');
            tempPosition.length = 0; //clear tempPosition array
            memPosition.length = 0; //clear memPosition array
      }

      function swapValByRow(initRow, endRow, initCol, endCol){
        if(initRow >endRow){
             const tempX = endCol;
             const tempY =endRow;
             endCol = initCol;
             endRow = initRow;
             initCol = tempX;
             initRow = tempY;
        }
        return { 'initRow':initRow, 'endRow':endRow, 'initCol':initCol, 'endCol':endCol};
      }

      function swapValByCol(initRow, endRow, initCol, endCol){
        if(initCol > endCol){
             const tempX = endCol;
             const tempY =endRow;
             endCol = initCol;
             endRow = initRow;
             initCol = tempX;
             initRow = tempY;
        }
        return { 'initRow':initRow, 'endRow':endRow, 'initCol':initCol, 'endCol':endCol};
      }
      //Function
      /**
      * @description  make line
      * @param {number} height
      * @param {number} width
      * @returns none
      **/
      function makeLine( initRow, endRow, initCol, endCol) {

          let previuosPoint = {'row': 0, 'col': 0};
          let m = ((endCol - initCol) !=0)?((endRow - initRow)/(endCol - initCol)):undefined;
          let b = initRow - (m * initCol);
          if(typeof(m) != 'undefined'){
           let nPosition = swapValByCol(initRow, endRow, initCol, endCol);
            for(let x = nPosition.initCol; x <= nPosition.endCol; x++){
              let y = Math.floor((m * x)+b);
              $("#pixel_canvas tr:eq("+y+") td:eq("+x+")").css('background-color',  colorPicker.value);
              tempPosition.push({'row':y,'col':x, 'color': colorPicker.value});
            }
            nPosition = swapValByRow(initRow, endRow, initCol, endCol);
            for(let y= nPosition.initRow; y <= nPosition.endRow; y++){
              let x = Math.floor((y-b)/m);
              $("#pixel_canvas tr:eq("+y+") td:eq("+x+")").css('background-color',  colorPicker.value);
              tempPosition.push({'row':y,'col':x, 'color': colorPicker.value});
            }
          }else{
            let nPosition = swapValByRow(initRow, endRow, initCol, endCol);
            for(let y = nPosition.initRow; y <=nPosition.endRow; y++){
              $("#pixel_canvas tr:eq("+y+") td:eq("+nPosition.initCol+")").css('background-color',  colorPicker.value);
              tempPosition.push({'row':y,'col':nPosition.initCol, 'color': colorPicker.value});
            }
          }
      }

      function makeRectangle( initRow, endRow, initCol, endCol){
           let nPosition = {};
           nPosition = swapValByCol(initRow, endRow, initCol, endCol);
           for(let i = nPosition.initCol; i <= nPosition.endCol;i++){
             $("#pixel_canvas tr:eq("+nPosition.initRow+") td:eq("+i+")").css('background-color',  colorPicker.value);
             tempPosition.push({'row':nPosition.initRow,'col':i, 'color': colorPicker.value});
             $("#pixel_canvas tr:eq("+nPosition.endRow+") td:eq("+i+")").css('background-color',  colorPicker.value);
             tempPosition.push({'row':nPosition.endRow,'col':i, 'color': colorPicker.value});
           }

           nPosition = swapValByRow(initRow, endRow, initCol, endCol);
           for(let i = nPosition.initRow; i <=nPosition.endRow;i++){
             $("#pixel_canvas tr:eq("+i+") td:eq("+nPosition.initCol+")").css('background-color',  colorPicker.value);
             tempPosition.push({'row':i,'col':nPosition.initCol, 'color': colorPicker.value});
             $("#pixel_canvas tr:eq("+i+") td:eq("+nPosition.endCol+")").css('background-color',  colorPicker.value);
             tempPosition.push({'row':i,'col':nPosition.endCol, 'color': colorPicker.value});
           }


      }
      function findObjInMem(position){
        return memPosition.find(function( obj ) {
                                      return obj.row == position.row && obj.col == position.col;
                                  });
      }

      function clearTempDraw(){
           tempPosition.forEach(function(position){
           let point = findObjInMem(position);
           if(typeof(point)  === 'undefined'){
             $("#pixel_canvas tr:eq("+position.row+") td:eq("+position.col+")").css('background-color', 'transparent');
           }else{
             $("#pixel_canvas tr:eq("+position.row+") td:eq("+position.col+")").css('background-color', point.color);
           }
         });
         tempPosition.length = 0; //clear tempPosition array
      }

      function getPosition(target){
         return {'row': target.parent().parent().children().index(target.parent()),
                 'col': target.parent().children().index(target),
                 'color': target.css("background-color")
                };
      }


      //Function
      /**
      * @description  put color in table cell
      * @param {obj} event
      **/
      function paint(event){
          let target = $( event.target );
           if(tool === 'dropper'){
               if($(this).css('backgroundColor') != 'rgba(0, 0, 0, 0)' || $(this).css('backgroundColor') != 'transparent'){
                 colorPicker.value =  rgb2hex($(this).css('backgroundColor'));
               }
          }else{
            target.css('background-color', colorPicker.value);
            memPosition.push(getPosition(target));
         }
      }

      function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

      //Function
      /**
      * @description  put color in table cell by mousemove event
      * @param {obj} event
      **/
      function mousemovePaint(event){

          let target = $( event.target );

          if(event.which === 1){
              //console.log(startPosition.x+", "+startPosition.y)
           if(tool == 'pen'){
              target.css('background-color', colorPicker.value);
              memPosition.push(getPosition(target));
            }else{
               let endPosition = getPosition(target);
               clearTempDraw();
               if(tool == 'line'){
                    makeLine( startPosition.row, endPosition.row, startPosition.col, endPosition.col);
               }else if(tool == 'rectangle'){
                    makeRectangle( startPosition.row, endPosition.row, startPosition.col, endPosition.col);
               }
            }
          }
      }

      function changeToolColorBackground(tool){
        $('li').css('background-color', '');
        tool.css('background-color', '#7F8C8D');
      }

      //Event listener - set isMouseDown = mousedown
      pixelCanvas.on('mousedown', 'td',function(event) {
          let target = $( event.target );
          if(tool == 'pen'){
            memPosition.push(getPosition(target));
          }else{
            memPosition = memPosition.concat.apply(memPosition,tempPosition);
          }

          tempPosition.length = 0;
          startPosition = getPosition(target);

      });

      //Event listener - set isMouseDown = mouseup
      $('body').on('mouseup',function(event) {
          $('#pixel_canvas td').off("mousemove");
      });

      //Event listener - Clear Table
      clearTableButton.click(function(){
        clearTable(height,width);
      });

      //Event listener - Line Tool
      drawLineButton.click(function(){
        tool = 'line';
        changeToolColorBackground($(this));
      });

      drawRectangleButton.click(function(){
        tool = 'rectangle';
        changeToolColorBackground($(this));
      });

      pen.click(function(){
        tool = 'pen';
        changeToolColorBackground($(this));
      });

      dropper.click(function(){
        tool = 'dropper';
        changeToolColorBackground($(this));
      })
      pixelCanvas.on("click", 'td',paint);
      pixelCanvas.on("mousemove", 'td',mousemovePaint);
});
