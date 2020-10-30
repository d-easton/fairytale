"""
NLP support script
    This file applies the NCR lexicon of emotional sentiment terms to the English and German
    fairytale corpora, inorder to prepare a clean dataset needed for the D3 visualizations.

    This is done in setup so the text processing side isn't done in the client browser; that process
    could easily slow down the visualization render time and make the page less responsive.
"""

import json
import re

# locations of all the files in each corpus
english_corpus_urls = [
    '../data/englishfairytales/tomtittot.txt',
    '../data/englishfairytales/themasterandhispupil.txt',
    '../data/englishfairytales/therosetree.txt',
    '../data/englishfairytales/thehistoryoftomthumb.txt',
    '../data/englishfairytales/thefishandthering.txt',
    '../data/englishfairytales/mrfox.txt',
    '../data/englishfairytales/howjackwenttoseekhisfortune.txt',
    '../data/englishfairytales/mollywhuppie.txt',
    '../data/englishfairytales/thewelloftheworldsend.txt',
    '../data/englishfairytales/thethreeheadsofthewell.txt',
]

german_corpus_urls = [
    '../data/germanfairytales/diefroschkoenig.txt',
    '../data/germanfairytales/derzauberlehrling.txt',
    '../data/germanfairytales/daumsdick.txt',
    '../data/germanfairytales/frauholle.txt',
    '../data/germanfairytales/hanselundgretel.txt',
    '../data/germanfairytales/rumpelstilzchen.txt',
    '../data/germanfairytales/diebremerstadtmusikanten.txt',
    '../data/germanfairytales/derteufelmitdendreigoldenenhaaren.txt',
    '../data/germanfairytales/vondemmachandelboom.txt',
    '../data/germanfairytales/derrauberbrautigem.txt',
]

# emotional index keywords, so no magic words on index into lexicon
ANGER = 0
ANTICIPATION = 1
DISGUST = 2
FEAR = 3
JOY = 4
NEGATIVE = 5
POSITIVE = 6
SADNESS = 7
SURPRISE = 8
TRUST = 9

TERM = 0
EMOTION = 1
VALUE = 2


# open a text and return a list of its tokens, cleaned up
def import_text(text_url):
    token_list = []
    with open(text_url) as t:
        for l in t.readlines(): 
            for t in l.split():
                token_list.append( re.sub(r'[^a-zA-Z0-9\s]', '', t.strip()).lower() )
    
    return token_list

def get_title(text_url):
    with open(text_url) as t:
        return t.readline().strip()

# generate corpus
def generate_corpus(corpus_urls):
    corpus_tokens = {}
    for url in corpus_urls:
        corpus_tokens[get_title(url)] = import_text(url) 
    return corpus_tokens

# open NCR lexicon, return as a dictionary containing relevant values
def compile_lexicon(url_to_lexicon):
    lexicon = {}
    with open(url_to_lexicon) as file:
        for l in file.readlines():
            elements = l.split()
            term = elements[TERM]
            # if(elements[EMOTION]=="anger"):
            #         print(term)
            if term in lexicon:
                lexicon[term][convert_emotion_to_index(elements[EMOTION])] += int(elements[VALUE])
            else:
                lexicon[term] = [0,0,0,0,0,0,0,0,0,0]
                lexicon[term][convert_emotion_to_index(elements[EMOTION])] += int(elements[VALUE]) 
    # print(lexicon)
    return lexicon   

def convert_emotion_to_index(emotion):
    if emotion == 'anger':
        return 0
    elif emotion == 'anticipation':
        return 1
    elif emotion == 'disgust':
        return 2
    elif emotion == 'fear':
        return 3
    elif emotion == 'joy':
        return 4
    elif emotion == 'negative':
        return 5
    elif emotion == 'positive':
        return 6
    elif emotion == 'sadness':
        return 7
    elif emotion == 'surprise':
        return 8
    elif emotion == 'trust':
        return 9
    else:
        return -1 # error out

def convert_index_to_emotion(index):
    if index == 0:
        return 'anger'
    elif index == 1:
        return 'anticipation'
    elif index == 2:
        return 'disgust'
    elif index == 3:
        return 'fear'
    elif index == 4:
        return 'joy'
    elif index == 5:
        return 'negative'
    elif index == 6:
        return 'positive'
    elif index == 7:
        return 'sadness'
    elif index == 8:
        return 'surprise'
    elif index == 9:
        return 'trust'
    else:
        return 'invalid'

# write data to .json file
def write_output(data, lang):
    output_dest = lang+'_emotion_data.json'
    with open(output_dest, 'w') as output_file:
        json.dump(data, output_file)
    return 0

def count_emotive_tokens(story):
    print()

def calculate_corpus_emotive_scores(corpus, lexicon):
    emotive_corpus = {}
    for title in corpus:
        emotive_scores = {
            "anger": 0,
            "anticipation": 0,
            "disgust": 0,
            "fear": 0,
            "joy": 0,
            "negative": 0,
            "positive": 0,
            "sadness": 0,
            "surprise": 0,
            "trust": 0
        }
        for token in corpus[title]:
            if token in lexicon:
                for i in range(0,10):
                    emotive_scores[convert_index_to_emotion(i)] += lexicon[token][i]
        
        emotive_corpus[title] = emotive_scores
    return emotive_corpus



def primary():
    # print(generate_corpus(english_corpus_urls))
    #print(english_corpus_urls)
    # print(generate_corpus(german_corpus_urls))
    # print(compile_lexicon("./NRC-Emotion-Lexicon-Wordlevel-v0.92.txt"))

    english_corpus = generate_corpus(english_corpus_urls)
    german_corpus = generate_corpus(german_corpus_urls)

    lexicon_path = "./NRC-Emotion-Lexicon-Wordlevel-v0.92.txt"
    lexicon = compile_lexicon(lexicon_path)

    english_emotive_scores = calculate_corpus_emotive_scores(english_corpus, lexicon) 
    german_emotive_scores = calculate_corpus_emotive_scores(german_corpus, lexicon) 

    write_output(english_emotive_scores, "english")
    write_output(german_emotive_scores, "german")

if __name__ == "__main__":
    print("launch")
    primary()
    print("DONE")
