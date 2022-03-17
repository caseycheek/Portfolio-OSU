
Project Name: Image Scraper Webapp 
Author: Casey Cheek 
Date: 06/04/2021 
Class: CS361 - Software Engineering I

Requirement Summary: 
Join a team wherein each person creates their own software in the language of their choice. Each person's software must provide a microservice to their team and consume at least one of their team member's microservices. The microservice must fit the theme of either 1) scraping content from Wikipedia or 2) transforming content.

Project Description: 
Given a search term, the Image Scraper gets “the single most appropriate thumbnail associated with [a Wikipedia] article”, in part by using the PageImages property of MediaWiki’s API, https://www.mediawiki.org/wiki/Extension:PageImages, and the PageProps property of MediaWiki's API, https://www.mediawiki.org/wiki/API:Pageprops. Image pixelation is provided by Ian Ording’s Image Transformer Microservice (found at https://image-pixelatorio.herokuapp.com/). After retrieving the data, the Image Scraper then displays the requested image and its attribution details for download. 
Note: This service was hosted on the OSU ENGR servers, and thus required the user to be logged into the OSU VPN. See the Image Scraper in action by watching the video here - https://youtu.be/4I-phCGEYD8
