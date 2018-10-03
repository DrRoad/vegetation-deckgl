#!/bin/bash
curl https://raw.githubusercontent.com/datasciencecampus/street-view-pipeline/master/data/cardiff_segments.zip -o cardiff_segments.zip 
unzip cardiff_segments.zip
rm -f cardiff_segments.zip
