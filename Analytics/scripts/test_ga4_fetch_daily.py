#!/usr/bin/env python3
import unittest

from ga4_fetch_daily import _event_counts_from_rows, _sum_metric_values


class ChatGPTDailyMetricHelpersTest(unittest.TestCase):
    def test_sum_metric_values_handles_empty_and_numeric_strings(self):
        rows = [
            (["chatgpt.com / referral"], ["3"]),
            (["chatgpt.com / (not set)"], ["4.0"]),
        ]

        self.assertEqual(_sum_metric_values(rows), 7)
        self.assertEqual(_sum_metric_values([]), 0)

    def test_event_counts_from_rows_returns_only_requested_events(self):
        rows = [
            (["begin_form"], ["2"]),
            (["generate_lead"], ["1.0"]),
            (["page_view"], ["9"]),
        ]

        self.assertEqual(
            _event_counts_from_rows(rows, ("begin_form", "generate_lead")),
            {"begin_form": 2, "generate_lead": 1},
        )


if __name__ == "__main__":
    unittest.main()
