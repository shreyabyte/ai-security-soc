import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import log_generator


class LogGeneratorTests(unittest.TestCase):
    def tearDown(self):
        log_generator.stop_background_generator()

    def test_start_background_generator_starts_once(self):
        first_thread = log_generator.start_background_generator()
        self.assertIsNotNone(first_thread)
        self.assertTrue(log_generator._generator_started)

        second_thread = log_generator.start_background_generator()
        self.assertIs(first_thread, second_thread)
