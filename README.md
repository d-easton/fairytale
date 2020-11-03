# Märchenhaft
CSE 457, Assignment 3
David Easton 458110
Fairy Tales Visualaizations

## Overview
- Goal: allow users to see the emotional differences between German and English versions of the same fairy tale
- Tasks: text analysis, comparative literature, understanding of cultural differences,
- Designs: Radar chart, bar charts, quantity graphic

## Project Description:
England and Germany share many cultural connections; one such linkage are fairy tales. Many classic English fairy tales, 
like Little Red Riding Hood or Rapunzel, were adapted from German originals. Others, like Jack and the Beanstalk or Goldilocks
and the Three Bears, gradually filtered from English to German storytellers. 

Though these stories have been told for hundreds of years, the formal movement to anthologise folk culture truly began in the 
nineteenth century. The Brothers Grimm led the charge with their _Kinder- und Hausmärchen_, published in the Kingdom of Westphalia 
in 1812. English versions proliferated in the following decades, notably including a collection titled _English Fairy Tales_ 
by Australian folklorist Joseph Jacobs in 1890. 

Today, the paired corpora have an enduring legacy on popular culture. This project, whose title is German for fantastical, presents 
an interactive way to examine how emotional themes in a common story vary across cultural background.

## Corpora Selection:
I first selected two corpora of fairy tales. The English language corpus was _English Fairy Tales_, published by Joseph Jacobs (1890).
The German language corpus came from the first two editions of the Grimms' Fairy Tales (1812, 1815). Both corpora were obtained in raw
text format from Project Gutenberg's open source literature initiative.

To narrow my frame of analysis, I selected ten stories that exist in both English and German adaptations. These ten stories are listed below.
Minor modifications (such as the inclusion of der Zauberlehrling, a 1797 ballad by Goethe often included as a fairy tale in German children's 
books) were made for the sake of consistency across text. The ten story pairs are as follows:

- The Master and His Pupil            -   Der Zauberlehrling
- The Rose-tree                       -   Von dem Machandelboom
- The History of Tom Thumb            -   Daumsdick
- The Fish and the Ring               -   Der Teuful mit den drei goldenen Haaren           
- Tom Tit Tot                         -   Rumpelstilzchen
- How Jack went to seek his fortune   -   Die Bremer Stadtmusikanten
- Molly Whuppie                       -   Hansel und Gretel
- Mr. Fox                             -   Der Räuberbräutigam            
- The Well of World's End             -   Der Froschkönig oder der eiserne Heinrich
- The Three Heads of the Well         -   Frau Holle 

## Text Analysis:
I wrote a python script to generate emotion-focused dataset from my corpus. I used the Emotion Association Lexicon published by the
National Research Council of Canada as key by which to generate emotive scores for each story. This lexicon maps 14,182 keyword to over 25,000
emotional senses. Emotional sense are represented by ten metrics: eight emotional categories (anger, anticipation, disgust, fear, joy, sadness, surprise, trust) and two sentiment valences (positive, negative). In every entry, a lexicon keyword is paired with an emotional metric and assigned a value of 1 if the keyword and metric are associated and a value of 0 if they are not. 

In my python script (./nlp/parse.py), I open and tokenize all stories. The lexicon is also loaded into the environment and stored in a dictionart for easy of comparison against tokens. The script iterates through each story and checks the lexicon for a keyword match for each token in the current story. For each story compared in this manner, the program writes the total score of words fitting each metric, as well as total story length, to a .json file. After data was initially written, I manually reformatted the story entries and and grouped paired stories into isolated .json files (./data/emotive_pairs). One of these story-paired .json files is loaded using d3.json() every time a navbar item is selected.

## Design:
My project represents the 11 data values associated with each story in three visualizations. The first is a quantity graphic that uses rectangular boxes to represent story length. The total length of a story is shown in boxes of at most 200 words. Next is the emotive radar chart, which maps the intensity of the story as a blob against eight emotional valence axes. The final chart is the valence bar graph, which shows the overall proportion of positive to negative sentiment valence in a given story.

These designs came from two initial designs that I ultimately chose to discard. The first rejected design was a simple bar graph that showed all ten metrics of each story in one view. I found this chart messy and rather bland. Positive and negative sentiment valence were lost among a jumble of emotional categories, even though these types of data measured different things. The bar graph visual was also rather bland; I shifted to a radar chart because it was a more interesting way to conceptualize a story, and allowed for easier comparison between columns. I first saw the idea for a radar chart in code examples I found online. Both examples (cited in sources) were written in D3 v3, so were largely unusable in my code. I did look over their implementation, and borrowed their basic idea for radar charts that feature blob designs and are implemented as pure functions with options rather than JavaScript prototypes.

The second design that I ultimately did not use was a line graph showing change in emotive score over the course of a story. I was originally drawn to this visualizaiton because it seemed like an interesting way to show how one plot diverged in emotional tone across translation. I decided against this visualization because of implementation challenges. To successfully pull this visualization off, I would need to re-work how I parsed stories and constructed my dataset. This challenge is compounded by the fact that few translations are of the same length. Such a task is definitely do-able, but not in-line with the dataset used by the rest of the project. For the sake of cohesiveness, efficiency, and simplicity of use, I decided to focus on overall emotional weighting of each story, rather than changing metrics within a story. I still think this idea would be  valuable to this project, so I'd like to implement it at a later date.

## Data Sources & Inspiration
- [English fairy tale corpus](https://www.gutenberg.org/ebooks/7439)
- [German fairy tale corpus](https://www.gutenberg.org/ebooks/2591)
- [NRC Word-Emotion Association Lexicon](https://saifmohammad.com/WebPages/NRC-Emotion-Lexicon.htm)
- [Basic idea to create a radar chart](https://github.com/alangrafu/radar-chart-d3)
- [Inspiration for function-based blob radar chart](https://www.visualcinnamon.com/2015/10/different-look-d3-radar-chart.html) 
- [Color-scheme loosely inspired by this book design](https://www.behance.net/gallery/71816595/Grimms-Fairy-Tales-Book)