import sys
import collections
import json

def get_zipcodes_with_multiple_tdsps(in_file_path):
    """Return zipcodes with multiple TDSPs"""
    src_list = []
    with open(in_file_path, "r") as file:
        for line in file.readlines():
            zipcode = line.split(",")[1]
            src_list.append(zipcode)
    
    return[item for item, count in collections.Counter(src_list).items() if count > 1]

def process_csv(in_file_path):
    "Build a 2 dimensional list"
    src_list = []
    with open(in_file_path, "r") as file:
        for line in file.readlines():
            zipcode = line.split(",")[1]
            tdsp = line.split(",")[2]
            src_list.append([zipcode, tdsp])
    
    return create_json_from_list(src_list)
    
def create_json_from_list(src_list):
    """Condense the list into a single dictionary where keys with multiple values 
    have those values appended"""
    temp_dict = collections.defaultdict(list)

    for k,v, in src_list:
        temp_dict[k].append(v)

    return dict((k, tuple(v)) for k, v in temp_dict.items())


def test_json(zipcode_list):
    """We know which zips have more than one TDSP. Test it."""
    duplicate_keys = [item for item, count in collections.Counter(zipcode_list).items() if count > 1]
    for k in duplicate_keys:
        assert len(lookup_dict[k]) > 1

if __name__ == "__main__":
    lookup_dict = process_csv("./lib/zipcode_to_tdsp.csv")
    zipcodes_to_test = get_zipcodes_with_multiple_tdsps("./lib/zipcode_to_tdsp.csv")

    test_json(zipcodes_to_test)  # tests not working, assert returns nothing?

    with open('lib/zipcode_to_tdsp.json', "w") as outfile:
        json.dump(lookup_dict, outfile, indent=4)
        