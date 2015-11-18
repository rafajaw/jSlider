/*

The MIT License (MIT)

Copyright (c) 2015 Rafael Luis Jacober Werlang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/


function get_current_screen_index( container_id )
{
  var container     =  $("#"+container_id);
  var first_screen  =  container.children(".jscreen").first();
  var screen_index  =  Math.abs(  Math.round( parseInt(first_screen.offset().left - container.offset().left) / parseInt(first_screen.css('width')) )  );
  //alert( 'current_screen_index = '+screen_index );
  return screen_index;
}

function get_current_screen( container_id )
{
  var screens    =  $("#"+container_id).children(".jscreen");
  var cur_index  =  get_current_screen_index( container_id );
  if( ! cur_index )
    cur_index = 0;
  return $(screens[cur_index]);
}

function get_previous_screen( container_id )
{
  var screens    =  $("#"+container_id).children(".jscreen");
  var cur_index  =  get_current_screen_index( container_id );
  //assert( cur_index );
  return $(screens[cur_index-1]);
}

function get_next_screen( container_id )
{
  var screens    =  $("#"+container_id).children(".jscreen");
  var cur_index  =  get_current_screen_index( container_id );
  if( ! cur_index )
    cur_index = 0;
  return $(screens[cur_index+1]);
}

function fit_container_height_to_screen( container, screen, animate )
{
  var new_height  =  $(screen).height( )  +
            parseFloat( $(screen).css('padding-top') )  +
            parseFloat( $(screen).css('padding-bottom') )  +
            parseFloat( $(screen).css('border-top-width') )  + 
            parseFloat( $(screen).css('border-bottom-width') );
  
  if( animate )
    $(container).animate({height:new_height+'px'});
  else
    $(container).css('height', new_height+'px');
}

function hide_all_screens_but_current( container_id )
{
    var cur_screen  =  get_current_screen( container_id )[0];
    $('#'+container_id).children(".jscreen").each( function(i, el){
      if( el != cur_screen )
        $(el).css('visibility', 'hidden');
    } );
}


// Public functions.
function slide_to_left( container_id )
{
  // show current and previous screen.
  $("#"+container_id).children(".jscreen").each( function(i, el){
    if(  i == get_current_screen_index( container_id )  ||  (i+1) == get_current_screen_index( container_id )  )
      $(el).css('visibility', 'visible');
  } );

  // slide vertically.
  var prev_screen  =  get_previous_screen( container_id );
  fit_container_height_to_screen( $('#'+container_id), prev_screen, true );
  
  var cur_screen_index  =  get_current_screen_index(container_id);
  var foo  =  '-'+(cur_screen_index - 1)*100+'%';
  // hide all screens but our current screen after the animations are completed. So that the inputs in other screens won't work at all.
  $("#"+container_id).children(".jscreen").animate({left:foo}).promise().done( function(){hide_all_screens_but_current(container_id);} );
}

function slide_to_right( container_id )
{
  // show current and next screen.
  $("#"+container_id).children(".jscreen").each( function(i, el){
    if(  i == get_current_screen_index( container_id )  ||  (i-1) == get_current_screen_index( container_id )  )
      $(el).css('visibility', 'visible');
  } );

  // slide vertically.
  var next_screen  =  get_next_screen( container_id );
  fit_container_height_to_screen( $('#'+container_id), next_screen, true );

  // slide horizontally.
  var cur_screen_index  =  get_current_screen_index( container_id );
  var foo  =  '-'+(cur_screen_index + 1)*100+'%';
  // hide all screens but our current screen after the animations are completed. So that the inputs in other screens won't work at all.
  $("#"+container_id).children(".jscreen").animate({left:foo}).promise().done( function(){hide_all_screens_but_current(container_id);} );
}



$('.jscreen-container').each(function(i,o){

  // remove whitespaces and linebreaks between the screen elements.
  $(o).contents( ).filter( function(){
    return  ( this.nodeType == 3 ); // Is it a text element?
  } ).remove( );

  // move screens horizontally up to the initial screen.
  var initial_screen = $(o).children('.jscreen').first( );
  $(o).children('.jscreen').each( function(i, el){
    if( $(el).hasClass('jinitial') )
    {
      initial_screen = $(el);
      $(o).children('.jscreen').animate({left:'-='+i*100+'%'}, 0);
      return false;
    }
  } );

  // set the initial height.
  fit_container_height_to_screen( o, initial_screen, false );

  // hide all screens but our current screen so that the inputs in other screens won't work at all.
  hide_all_screens_but_current( $(o).attr('id') );

  // show the container element.
  $(o).css('visibility', 'visible');

});
