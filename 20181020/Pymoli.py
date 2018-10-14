# invoke the necessary libraries
import pandas as pd
import numpy as np

# going to try to retrain myself to use single ' versus " b/c it's faster to type
# creating a variable to hold the contents of a dataset
initialFile = 'purchase_data.csv'
# reading the file
readFile = pd.read_csv(initialFile, encoding = 'utf-8')

# creating the initial data frame
init_df = pd.DataFrame(readFile)

# displaying the header and first five rows
init_df.head()

# displaying overview of stats
#init_df.describe()

# displaying columns
#init_df.columns

# displaying data types by column
#init_df.dtypes

### Player Count ###

# count then number of unique players
playerCnt = len(init_df['SN'].unique())
summCnt = pd.DataFrame({"Total Players": [playerCnt]})
summCnt

### Purchasing Analysis (Total) ###

# count the number of unique items
itemCnt = len(init_df["Item ID"].unique())

# calcualte the average price
avgPrice = round(init_df["Price"].mean(),2)
avgPrice

# calculate the number of purchases
purchases = init_df["Item Name"].count()
purchases

# calculate the total revenue (aka gross revenue)
revenue = init_df["price"].sum()
revenue

# create the summary data frame for the analysis 
sumPurch_df = pd.DataFrame({"Number of Unique Items": [itemCnt], "Average Price": [avgPrice], \
"Number of Purchases": [purchases], "Total Revenue": [revenue]})

# formatting the average price and total revenue to currency format
sumPurch_df['Average Price'] = sumPurchAnalysis_df['Average Price'].map("${:,.2f}".format)
sumPurch_df['Total Revenue'] = sumPurchAnalysis_df['Total Revenue'].map("${:,.2f}".format)
sumPurch_df

### Gender Demographics ###

# grouping the data by gender count and storing results in a summary data frame
genderCnt = init_df.groupby('Gender').SN.nunique()
summGender = pd.DataFrame(genderCnt)
# renaming the SN column to match the homework solution
summRename = summGender.rename(columns={'SN': 'Total Count'})
# adding the percentages for each gender to the data frame
summRename['Percentage of Players'] = summRename['Total Count']/summRename['Total Count'].sum() * 100
# formatting the percentage as a percentage
summRename['Percentage of Players'] = summRename['Percentage of Players'].map("{:.2f}".format)

### Purchasing Analysis (Gender) ###

#Purchase Count
purCnt= init_df.groupby(['Gender']) ['SN'].count()

# Average Purchase Price
avgPP = init_df.groupby(['Gender']) ['Price'].mean().head()

# Total Purchase Value
totPV = init_df.groupby(['Gender']) ['Price'].sum().head()

# Average Total Purchase per Person
avgTPP = init_df.groupby(['Gender']) ['Price'].sum() / init_df.groupby('Gender').SN.nunique()

# Summary
summPAG = pd.DataFrame({'Purchase Count': purCnt, 'Average Purchase Price': avgPP, 'Total Purchase Value': totPV, \
'Avg Total Purchase per Person': avgTPP})

# Formatting
summPAG['Average Purchase Price'] = summPAG['Average Purchase Price'].map("${:,.2f}".format)
summPAG['Total Purchase Value'] = summPAG['Total Purchase Value'].map("${:,.2f}".format)
summPAG['Avg Total Purchase per Person'] = summPAG['Avg Total Purchase per Person'].map("${:,.2f}".format)

summPAG.head()

### Age Demographics ###

# Establish bins for ages
ageBins = [0, 9, 14, 19, 24, 29, 34, 39, 150]
ageRange = ['<10','10-14','15-19','20-24','25-29','30-34','35-39','40+']

# Categorize the existing players using the age bins (Hint: use pd.cut())
init_df['Age Range'] = pd.cut(init_df['Age'], ageBins, labels=ageRange)
ageDemo = init_df

# grouping the data by age rante and storing in a data frame
ageGroup = ageDemo.groupby('Age Range').SN.nunique()
summAge = pd.DataFrame(ageGroup)

# renaming column to match the homework
summAgeRN = summAge.rename(columns={'SN': 'Total Count'})

# calculating the percentage of players
summAgeRN['Percentage of Players'] = summAgeRN['Total Count']/summAgeRN['Total Count'].sum() * 100

# formatting the percentage to two decimal places
summAgeRN['Percentage of Players'] = summAgeRN['Percentage of Players'].map("{:.2f}".format)

# display the table
summAgeRN.head(8)
