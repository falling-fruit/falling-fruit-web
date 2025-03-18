"""
TAP (Test Anything Protocol) stream implementation.
Provides utilities for generating TAP-formatted test output.
"""
import re

class TapStream:
    """
    A class to generate TAP (Test Anything Protocol) formatted output.
    """
    
    def __init__(self):
        self.test_count = 0
        self.current_test = 0
        self.header_printed = False
    
    def plan(self, count):
        """Set the total number of tests and print the TAP header"""
        self.test_count = count
        print(f"1..{count}")
        self.header_printed = True
    
    def ok(self, description, comment=None):
        """Print a passing test"""
        self.current_test += 1
        comment_str = f" # {comment}" if comment else ""
        print(f"ok {self.current_test} - {description}{comment_str}")
        return True
    
    def not_ok(self, description, comment=None):
        """Print a failing test"""
        self.current_test += 1
        comment_str = f" # {comment}" if comment else ""
        print(f"not ok {self.current_test} - {description}{comment_str}")
        return False
    
    def subtest_ok(self, description, comment=None):
        """Print a passing subtest"""
        comment_str = f" # {comment}" if comment else ""
        print(f"    ok {self.current_test} - {description}{comment_str}")
        return True
    
    def subtest_not_ok(self, description, comment=None):
        """Print a failing subtest"""
        comment_str = f" # {comment}" if comment else ""
        print(f"    not ok {self.current_test} - {description}{comment_str}")
        return False
    
    def subtest(self, index, description, passed, comment=None):
        """Print a subtest with the given index"""
        comment_str = f" # {comment}" if comment else ""
        status = "ok" if passed else "not ok"
        print(f"    {status} {index} - {description}{comment_str}")
        return passed
        
    def extract_template_vars(self, text):
        """Extract template variables like {{ var_name }} from text"""
        if not text:
            return set()
        
        # Handle both string and list values
        if isinstance(text, list):
            vars_set = set()
            for item in text:
                if isinstance(item, str):
                    vars_set.update(self.extract_template_vars(item))
            return vars_set
        
        # Extract variables using regex
        template_vars = re.findall(r'{{\s*([^}]*?)\s*}}', text)
        return set(template_vars)
    
    def check_translations_tap(self, all_keys, key_to_files, translations, languages):
        """
        Check translations and output results in TAP format
        
        Parameters:
        - all_keys: List of all translation keys from source files
        - key_to_files: Dictionary mapping keys to their source files
        - translations: Dictionary mapping language codes to Translation objects
        - languages: List of language codes
        """
        # Count total tests: one for each key in source + one for orphan keys test
        total_tests = len(all_keys) + 1
        
        # Create plan
        self.plan(total_tests)
        
        # Check each key in each language using subtests
        for test_number, key in enumerate(sorted(all_keys), 1):
            # Get source files as comments
            source_files = key_to_files.get(key, ["unknown"])
            source_files_str = ", ".join(source_files)
            
            # Count missing translations for this key
            missing_count = 0
            template_var_issues = False
            
            # Get English template variables for comparison
            en_translation = translations.get('en')
            en_value = en_translation.get(key) if en_translation else None
            en_template_vars = self.extract_template_vars(en_value) if en_value else set()
            
            for lang in sorted(languages):
                if lang == 'en':  # Skip English for missing check
                    continue
                    
                translation = translations[lang]
                value = translation.get(key)
                
                if value is None:
                    missing_count += 1
                elif en_template_vars:  # Only check if English has template vars
                    lang_template_vars = self.extract_template_vars(value)
                    if lang_template_vars != en_template_vars:
                        template_var_issues = True
            
            # Report test result
            if missing_count == 0 and not template_var_issues:
                self.ok(f"'{key}'", source_files_str)
            else:
                self.not_ok(f"'{key}'", source_files_str)
                if en_template_vars:
                    print(f"    # English vars: {', '.join(en_template_vars)}")
            
            # Print subtests for each language
            for subtest_number, lang in enumerate(sorted(languages), 1):
                translation = translations[lang]
                value = translation.get(key)
                
                if value is None:
                    self.subtest(subtest_number, lang, False, "missing translation")
                elif lang != 'en' and en_template_vars:
                    lang_template_vars = self.extract_template_vars(value)
                    if lang_template_vars != en_template_vars:
                        missing_vars = en_template_vars - lang_template_vars
                        extra_vars = lang_template_vars - en_template_vars
                        error_msg = []
                        if missing_vars:
                            error_msg.append(f"missing vars: {', '.join(missing_vars)}")
                        if extra_vars:
                            error_msg.append(f"extra vars: {', '.join(extra_vars)}")
                        self.subtest(subtest_number, lang, False, "; ".join(error_msg))
                    else:
                        self.subtest(subtest_number, lang, True)
                else:
                    self.subtest(subtest_number, lang, True)
        
        # Check for orphan keys (keys in translation files not in source)
        orphan_keys_found = False
        
        # Collect orphan keys for each language
        orphan_keys_by_lang = {}
        for lang in sorted(languages):
            translation = translations[lang]
            orphan_keys = []
            
            for key in translation.entries.keys():
                if key not in all_keys:
                    orphan_keys.append(key)
                    orphan_keys_found = True
            
            orphan_keys_by_lang[lang] = orphan_keys
        
        # Print orphan keys test result
        self.ok("orphan keys") if not orphan_keys_found else self.not_ok("orphan keys")
        
        # Print subtests for each language
        for subtest_number, lang in enumerate(sorted(languages), 1):
            orphan_keys = orphan_keys_by_lang[lang]
            
            if not orphan_keys:
                self.subtest(subtest_number, lang, True)
            else:
                self.subtest(subtest_number, lang, False, ", ".join(orphan_keys))
