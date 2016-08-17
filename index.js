'use strict';

const fs          = require('fs');
const path        = require('path');
const program     = require('commander');
const _directory  = '../diegoepunan_com/albums/';
const _target     = './posts/';


/**
 * getDirectories( @path )
 * read directories within a directory (not recursive)
 * @srcpath: directory path | string
 * return array
 */
function getDirectories( srcpath ) {
  return fs.readdirSync(srcpath).filter(file => fs.statSync(path.join(srcpath, file)).isDirectory());
}


/**
 * cleanName( @filename );
 * @filename: directory containing albums names | array
 * return array

function cleanName ( filename ) {
  let filenames = [];

  if( Object.prototype.toString.call( filename ) === '[object Array]' ) {
    filename.forEach((value, index) => {
      filenames.push( value.toLowerCase().substring(4) );
    });
  }
  return filenames;
}
 */
function cleanName ( filename ) {
  return filename.toLowerCase().substring(4);
}


/**
 *
 */
function formatOutput( imagePath ) {
  let type = '';
  const extension = imagePath.substr(imagePath.length - 3).toLowerCase();

  if( extension == 'jpg') {
    type = '!';
  } else if( extension == 'mp4' ) {
    type = '%';
  }
  return `${type}[](${imagePath})\r`;
}

/**
 * getFiles( @dir );
 * read filename from album content
 * @dir: directory | string
 * return array;
 */
function getFiles( dir ){
  const files_ = [];
  const files = fs.readdirSync(dir);
  for (const i in files){
    const name = `${dir}/${files[i]}`;
    if (fs.statSync(name).isDirectory()){
      getFiles(name, files_);
    } else {
      files_.push( formatOutput(name) );
    }
  }
  return files_;
}


/**
 * writeToFile( @params );
 * @content: string | content scraped
 * @sitename: string | clean name of site
 * @callback: function | callback
 * return callback
 *
 * saves content to file for each file
 *
 */
function writeToFile( content, sitename ) {
  fs.writeFile(`${_target + sitename}.md`, content, err => {
    if(err) {
      return console.log(err);
    }
    console.log(`The file ${sitename} was created!`);
  });
}


/**
 * work( @params );
 *
 * @array: array | of site url's
 * @callback: function | callback
 *
 */
function work( array, callback ){

  array.forEach( (value, index) => {
    const filename = cleanName( value );
    const albumpath = _directory + value;

    writeToFile( '---\rlayout: post \rtitle: ' + filename + '\r---\r' + getFiles( albumpath ).join(''), filename );

  });

  // callback
  if (callback && typeof(callback) === "function") {
    callback.apply();
  }

}

// APPLY
work( getDirectories(_directory) );
