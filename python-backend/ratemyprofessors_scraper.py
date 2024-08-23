import requests
from bs4 import BeautifulSoup  # from bs4 package import BeautifulSoup class
import csv   # module to read & write to csv files


def scrape_ratemyprofessors(school_id, num_pages=1):
    base_url = f"https://www.ratemyprofessors.com/search/teachers?sid={school_id}&pageNum="
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }

    professors = []

    for page in range(1, num_pages + 1):
        url = base_url + str(page)
        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.content, 'html.parser')

        professor_cards = soup.find_all(
            'div', class_='TeacherCard__StyledTeacherCard-syjs0d-0')

        for card in professor_cards:
            name = card.find(
                'div', class_='CardName__StyledCardName-sc-1gyrgim-0').text.strip()
            department = card.find(
                'div', class_='CardSchool__Department-sc-19lmz2k-0').text.strip()
            rating = card.find(
                'div', class_='CardNumRating__CardNumRatingNumber-sc-17t4b9u-2').text.strip()

            professors.append({
                'Name': name,
                'Department': department,
                'Rating': rating
            })

    return professors


# Example usage
school_id = 953  # Replace with the actual school ID
results = scrape_ratemyprofessors(school_id, num_pages=2)

# Save results to CSV
with open('professors.csv', 'w', newline='', encoding='utf-8') as csvfile:
    fieldnames = ['Name', 'Department', 'Rating']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    writer.writeheader()
    for professor in results:
        writer.writerow(professor)

print(f"Scraped {len(results)} professors and saved to professors.csv")
