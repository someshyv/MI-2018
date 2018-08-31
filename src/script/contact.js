import * as $ from 'jquery';
import { addInvert } from './main.js';
import { teams } from './people.js';

export default function() {
    addInvert();
    var currentElem = $('#cu-compi');

    $('#mi-cu-container').on('scroll', function() {
      var top = $(this).children().first();
      $(this).children().each(function(){
          var offset = $(this).offset().top;
          if(offset >= 0 && offset < $(this).height()){
              top = $(this);
              return false;
          }
      });

      if (top.attr('id') != currentElem.attr('id')) {
        console.log(top.attr('id'));
        currentElem = top;
        $('.mi-cu-num-template').removeClass('active');
        $('.cu-section').removeClass('active');
        $('a[href="#' + top.attr('id') + '"]').addClass('active');
      }
    });

    var templ = $(".mi-cu-img-template");
    var sectempl = $('#cu-section-template');
    var numtempl = $('.mi-cu-num-template');
    var activeDone = false;
    var index = 1;

    for (const team of teams) {
        var outerSection = document.createElement('div');
        $(outerSection).attr('id', 'cu-' + team.short_name)
                    .appendTo($("#mi-cu-container"));

        $(document.createElement('div')).addClass('mi-cu-dep-name')
                                        .html(team.name)
                                        .appendTo($(outerSection));

        var section = document.createElement('div');
        $(section).addClass('mi-cu-panel')
                .appendTo($(outerSection));

        for (const cg of team.people) {
            var newnode = templ.clone();
            newnode.find('.mi-cu-cg-img').attr('src', 'images/people/' + cg.image);
            newnode.find('.mi-cu-name').html(cg.name);
            if ('department' in cg) {
                newnode.find('.mi-cu-dept').html(cg.department);
            } else {
                newnode.find('.mi-cu-dept').html(team.name);
            }
            newnode.find('.mi-cu-tel').html(cg.tel);
            newnode.find('.mi-cu-tel').attr('href', 'tel:' + cg.tel);
            newnode.find('.mi-cu-email').html(cg.email);
            newnode.find('.mi-cu-email').attr('href', 'email:' + cg.email);
            newnode.appendTo($(section));
        }

        var secnode = sectempl.clone();
        secnode.find('.cu-section').attr('href', '#cu-' + team.short_name);
        secnode.find('.cu-section').html(team.name);
        secnode.appendTo($('#cu-sections-ul'))

        var numnode = numtempl.clone();
        numnode.html(index);
        numnode.attr('href', '#cu-' + team.short_name);
        index++;
        numnode.appendTo('.mi-cu-indices');

        if (!activeDone) {
        activeDone = true;
        secnode.find('.cu-section').addClass('active');
        numnode.addClass('active');
        }
    }
    templ.remove();
    sectempl.remove();
    numtempl.remove();
}