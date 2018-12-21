# Importing dependencies
from bs4 import BeautifulSoup as bs
from splinter import Browser
import pandas as pd
import requests
import time
import pymongo


def init_browser():
    # path to the chromedriver
    executable_path = {"executable_path": "/usr/local/bin/chromedriver"}
    return Browser("chrome", **executable_path, headless=False)


def scrape_info():
    browser = init_browser()
  
    ###############################################
    #   NASA MARS NEWS SCRAPE
    ###############################################

    # base url for the website that will be scraped
    base_url = 'https://mars.nasa.gov'
    # news url that contains the latest News Title and Paragraph text
    news_url = 'https://mars.nasa.gov/news/'
    # executing the visit to the website
    browser.visit(news_url)
    time.sleep(1)
    # creating a variable to hold the results of the source html
    news_html = browser.html
    # parsing through the html
    news_soup = bs(news_html, 'html.parser')
    # variable to hold the first news story title
    news_title = news_soup.find('div',class_='bottom_gradient').text
    # variable to hold the url extension for the latest news title which when added to the base url
    # will provide the navigation to the first news title content
    news_p_url = news_soup.find('div', class_='image_and_description_container').find_all('a', href=True)[0]['href']
    # variable to produce the link needed to get to the content of the latest news
    p_url = base_url + news_p_url
    # visiting the p_url in order to obtain the paragraph text
    browser.visit(p_url)
    time.sleep(1)
    # creating a variable to hold the results of the source html
    p_html = browser.html
    # parsing through the html
    p_soup = bs(p_html, 'html.parser')
    # variable to hold the paragraph text
    news_p = p_soup.find_all('p')[1].text


    ###############################################
    #   JPL Mars Space Images
    ###############################################
 
    # variable to hold the base url
    jpl_base_url = 'https://www.jpl.nasa.gov'
    # variable to hold url to scrape
    jpl_url = 'https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars'
    #visit the jpl_url
    browser.visit(jpl_url)
    time.sleep(1)

    # creating a variable to hold the results of the source html
    jpl_html = browser.html
    # parsing the html source code
    jpl_soup = bs(jpl_html, 'html.parser')
    # variable to hold image url    
    images = jpl_soup.find('div', class_='carousel_items').find('article')['style']
    # removing -- stripping -- the leading text
    images = images.strip("background-image: url(';")
    # removing -- stripping -- the trailing text
    images = images.strip("')")
    # variable to hold the complete url string
    featured_image_url = jpl_base_url + images

    ###############################################
    #   Mars Weather
    ###############################################

    tweet_url = 'https://twitter.com/marswxreport?lang=en'
    tweetRequest = requests.get(tweet_url)
    tweet_soup = bs(tweetRequest.text, 'html.parser')
    mars_weather = tweet_soup.find('div', class_='js-tweet-text-container').text

    ###############################################
    #   Mars Facts
    ###############################################    

    # variable to hold the url
    facts_url = 'http://space-facts.com/mars/'
    # using pandas to read the html from the url and storing table into a variable
    tables = pd.read_html(facts_url)
    # converting the list to a dataframe by selecting the first (and only in this case) table from the list
    df = tables[0]
    # adding column descriptions
    df.columns = ['Profile Description','Facts' ]
    # removing the first row -- cleanup
    df = df.iloc[0:]
    # setting the description as the index
    df.set_index('Profile Description', inplace=True)
    # using the Pandas 'to_html' method to generate HTML table from the existing dataframe
    html_table = df.to_html()

    ###############################################
    #   Mars Hemispheres
    ###############################################

    # variable to hold base url for Mars Hemispheres information
    mh_base_url = 'https://astrogeology.usgs.gov'
    # variable to hold url with Mars Hemispheres information
    mh_url = 'https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars'
    # engaging with chrome browser
    browser.visit(mh_url)
    time.sleep(1)
    # creating an html object
    mh_html = browser.html
    # parse the html using Beautiful Soup
    mh_soup = bs(mh_html, 'html.parser')
    # retrieve each link to the hemispheres info
    hemispheres = mh_soup.find_all('div', class_='description')#[1].find('a', href=True)['href']
    
    # list variable to hold results of for loop
    hemisphere_image_urls = []

    for item in hemispheres:
        # retrieving the href
        mh_href = item.find('a', href=True)['href']
        
        # combining the piece to make a full url path
        full_url = mh_base_url + mh_href
        
        # going to website
        browser.visit(full_url)
        time.sleep(1)
        
        # takes the html source code and puts it into a variable
        mh_href_html = browser.html
        
        # parse the html using Beautiful Soup
        mh_soup_links = bs(mh_href_html, 'html.parser')
        
        # ffs, we are finally retrieving something
        # retrieving the title
        mh_href_title = mh_soup_links.find('h2', class_="title").text
        
        # retrieving the second a tag / href image link
        mh_href_img = mh_soup_links.find_all('div', class_='downloads')
        print(mh_href_img)
        for img in mh_href_img:
            img_url = img.find_all('a', href=True)[1]['href']
    
            
        # append the title and image link to the list of dictionaries
        hemisphere_image_urls.append({'title': mh_href_title, 'img_url': img_url})

    # store all the scraped data in a dictionary
    mars_data = {
        "news_title": news_title,
        "news_paragraph": news_p,
        "featured_image_url": featured_image_url,
        "mars_weather": mars_weather,
        "hemisphere_info": hemisphere_image_urls,
        "html_table": html_table
    }

    #close the browser after scraping
    browser.quit()

    # return results
    return mars_data