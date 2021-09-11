
/*
Walking the Dom
The following is a list of variables that correspond to the different elements in the DOM.
*/
// Input Elements

let viewportWidth_input = document.getElementById('viewport-width');
let viewportHeight_input = document.getElementById('viewport-height');
let desiredWidth_input = document.getElementById('desired-width');
let desiredHeight_input = document.getElementById('desired-height');
let minFontSize_input = document.getElementById('min-font-size');
let maxFontSize_input = document.getElementById('max-font-size');
// output elements
let percentageWidth_input = document.getElementById('percentage-width');
let percentageHeight_input = document.getElementById('percentage-height');
let vw_input = document.getElementById('vw');
let vh_input = document.getElementById('vh');
let em_input = document.getElementById('em');
let vminWidth_input = document.getElementById('vmin-width');
let vmaxWidth_input = document.getElementById('vmax-width');
let vmaxHeight_input = document.getElementById('vmax-height');
let vminHeight_input = document.getElementById('vmin-height');
let desiredAspectRatio_input = document.getElementById('desired-aspect-ratio');

let inputElements = [ 
    viewportWidth_input, 
    viewportHeight_input, 
    desiredWidth_input, 
    desiredHeight_input, 
    minFontSize_input, 
    maxFontSize_input
];
let outputElements = [ 
    percentageWidth_input, 
    percentageHeight_input,
    vw_input, 
    vh_input, 
    em_input, 
    vminWidth_input, 
    vmaxWidth_input, 
    vmaxHeight_input,
    vminHeight_input,
    desiredAspectRatio_input 
];

// returns an array of values
function mapInputsToValues(){
    return inputElements.map(element=>element.value);
}
/**
 * @name calcAspectRatio
 * @description Calculate the aspect ratio of a given element and returns it as number / number
 * @param {Number} width
 * @param {Number} height
 * @returns {String}
 */
 function findAspectRatio(w,h){
    let dividend,divisor;
    if(h == w){
        return '1 : 1';
    }else{
        let mode = null;
        if(h>w)
        {
            dividend  = h;
            divisor   = w;
            mode      ='portrait';
        }

        if(w>h){
            dividend   = w;
            divisor    = h;
            mode       = 'landscape';
        }

        let gcd = -1;
        while(gcd == -1){
            remainder = dividend%divisor;
            if(remainder == 0){
                gcd = divisor;
            }else{
                dividend  = divisor;
                divisor   = remainder;
            }
        }

        let hr         = w/gcd;
        let vr         = h/gcd;
        return (hr + ' : ' + vr);
    }
}
let viewport = {
    width:0,
    height:0,
    fontSize:0
}
let precision = 2;

const calcUnit = (v,factor=viewport.width) =>{
    const {width,height,fontSize} = viewport;
    return {
        vw:(v / width).toPrecision(precision)*100,
        percentageWidth:(v / (factor)).toPrecision(precision)*100,
        percentageHeight:(v / (factor === viewport.width ? viewport.height : factor)).toPrecision(precision)*100,
        vh:(v / height).toPrecision(precision)*100,
        em:(v / fontSize).toPrecision(precision)
    }
};

function scaleFont (minSize,maxSize,minScreen,maxScreen,currentSize){
    let minResult = minSize;
    let maxResult = maxSize;
    let result =  minSize + (maxSize - minSize) * (( currentSize - minScreen) / (maxScreen - minScreen));
    if( result > maxResult){
        return maxResult;
    }else if (result < minResult) {
        return minResult;
    }else{
        return result;
    }
}

inputElements.forEach(element=>{
    element.addEventListener('change',()=>{
        let [viewportWidth,viewportHeight,,,minFontSize,maxFontSize] = mapInputsToValues();
        if(viewportWidth && viewportHeight && minFontSize && maxFontSize){        
        viewport.width = viewportWidth;
        viewport.height = viewportHeight;
        viewport.fontSize = scaleFont(minFontSize,maxFontSize,viewportWidth,viewportHeight,viewportWidth);
        }else if( viewportWidth && viewportHeight){
            viewport.width = viewportWidth;
            viewport.height = viewportHeight;
        }
        sessionStorage.setItem('savedData',JSON.stringify(mapInputsToValues()));
    });
});

document.addEventListener('DOMContentLoaded',()=>{
    let savedData = JSON.parse(sessionStorage.getItem('savedData'));
    if(savedData){
        inputElements.forEach((element,index)=>{
            element.value = savedData[index];
        });
        viewport.width = savedData[0];
        viewport.height = savedData[1];
        viewport.fontSize = scaleFont(savedData[4],savedData[5],savedData[0],savedData[1],savedData[0]);
    }
});

document
.getElementById("calculate")
.addEventListener('click',()=>{
    let [viewportWidth,viewportHeight,desiredWidth,desiredHeight] = mapInputsToValues().map(Number);
    let minUnit = viewportWidth > viewportHeight ? viewportHeight : viewportWidth;
    let maxUnit = viewportWidth > viewportHeight ? viewportWidth : viewportHeight;
    percentageWidth_input.value = calcUnit(desiredWidth,viewportWidth).percentageWidth;
    percentageHeight_input.value = calcUnit(desiredHeight,viewportHeight).percentageHeight;
    vw_input.value = calcUnit(desiredWidth,viewportWidth).vw;
    vh_input.value = calcUnit(desiredHeight,viewportHeight).vh;
    em_input.value = calcUnit(desiredWidth,viewportWidth).em;
    vminWidth_input.value = calcUnit(desiredWidth,minUnit).vw;
    vmaxWidth_input.value = calcUnit(desiredWidth,maxUnit).vw;
    vmaxHeight_input.value = calcUnit(desiredHeight,maxUnit).vh;
    vminHeight_input.value = calcUnit(desiredHeight,minUnit).vh;
    desiredAspectRatio_input.value = findAspectRatio(desiredWidth,desiredHeight);
});
