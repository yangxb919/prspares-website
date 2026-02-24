-- Allow authenticated admin users to delete newsletter subscriptions.
drop policy if exists "authenticated_delete_newsletter_subscriptions" on public.newsletter_subscriptions;
create policy "authenticated_delete_newsletter_subscriptions"
  on public.newsletter_subscriptions
  for delete
  to authenticated
  using (true);
