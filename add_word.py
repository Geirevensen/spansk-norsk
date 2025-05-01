import xml.etree.ElementTree as ET

# Filstier
XML_FILE = "dictionary.xml"

# Nye orddata (dette ville normalt komme fra brukerinput eller argumenter)
new_spanish = "gato"
new_norwegian = "katt"
new_pos = "substantiv"
new_gender = "maskulin"
new_definition = "et lite, tamt pattedyr som ofte holdes som kjæledyr"
new_inflections = {
    "plural": "gatos",
    "feminine": "gata",
    "feminine_plural": "gatas"
}
new_example_es = "El gato duerme en la silla."
new_example_no = "Katten sover på stolen."
new_tags = "dyr"

# Parse eksisterende XML-fil
tree = ET.parse(XML_FILE)
root = tree.getroot()

# Opprett nytt <entry>-element
entry = ET.Element("entry")
# Lag underelementer og sett tekstinnhold
spanish_elem = ET.SubElement(entry, "spanish")
spanish_elem.text = new_spanish
nor_elem = ET.SubElement(entry, "norwegian")
nor_elem.text = new_norwegian
pos_elem = ET.SubElement(entry, "pos")
pos_elem.text = new_pos
if new_gender:
    gender_elem = ET.SubElement(entry, "gender")
    gender_elem.text = new_gender
if new_definition:
    def_elem = ET.SubElement(entry, "definition")
    def_elem.text = new_definition

# Bøyninger
if new_inflections:
    infl_elem = ET.SubElement(entry, "inflections")
    for form, form_value in new_inflections.items():
        child = ET.SubElement(infl_elem, form)
        child.text = form_value

# Eksempelsetning(er)
examples_elem = ET.SubElement(entry, "examples")
ex_elem = ET.SubElement(examples_elem, "example")
ex_es = ET.SubElement(ex_elem, "spanish")
ex_no = ET.SubElement(ex_elem, "norwegian")
ex_es.text = new_example_es
ex_no.text = new_example_no

# Tagger
if new_tags:
    tags_elem = ET.SubElement(entry, "tags")
    tags_elem.text = new_tags

# Legg til den nye oppføringen i rotnoden
root.append(entry)

# Skriv tilbake til XML-filen (med utf-8 encoding og XML-deklarasjon)
tree.write(XML_FILE, encoding="UTF-8", xml_declaration=True)
print(f"Ordet '{new_spanish}' ble lagt til i ordboken.")
