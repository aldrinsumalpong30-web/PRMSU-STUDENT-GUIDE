-- Run in Supabase > SQL Editor
create table categories(id serial primary key,category_name text not null,description text);
create table buildings(id serial primary key,building_name text not null,description text,latitude double precision not null,longitude double precision not null);
create table departments(id serial primary key,department_name text not null,slug text unique not null,category_id int not null references categories(id),building_id int references buildings(id) on delete set null,description text,programs text,image text,contact_email text,contact_number text,created_at timestamptz default now(),updated_at timestamptz default now());
create table department_images(id serial primary key,department_id int not null references departments(id) on delete cascade,image_path text not null,created_at timestamptz default now());
create table admins(user_id uuid primary key references auth.users(id) on delete cascade);
create function public.is_admin() returns boolean language sql security definer stable set search_path=public as $$ select exists(select 1 from public.admins where user_id=auth.uid()) $$;
alter table categories enable row level security;alter table buildings enable row level security;alter table departments enable row level security;alter table department_images enable row level security;alter table admins enable row level security;
create policy "read" on categories for select using(true);create policy "read" on buildings for select using(true);create policy "read" on departments for select using(true);create policy "read" on department_images for select using(true);
create policy "admin write" on categories for all to authenticated using(is_admin()) with check(is_admin());
create policy "admin write" on buildings for all to authenticated using(is_admin()) with check(is_admin());
create policy "admin write" on departments for all to authenticated using(is_admin()) with check(is_admin());
create policy "admin write" on department_images for all to authenticated using(is_admin()) with check(is_admin());
create policy "self" on admins for select to authenticated using(user_id=auth.uid());
insert into storage.buckets(id,name,public) values('department-images','department-images',true) on conflict do nothing;
create policy "img read" on storage.objects for select using(bucket_id='department-images');
create policy "img insert" on storage.objects for insert to authenticated with check(bucket_id='department-images' and public.is_admin());
create policy "img update" on storage.objects for update to authenticated using(bucket_id='department-images' and public.is_admin());
create policy "img delete" on storage.objects for delete to authenticated using(bucket_id='department-images' and public.is_admin());
insert into categories(category_name) values('Colleges and Academic Departments'),('Administrative Offices'),('Student Services'),('Campus Facilities'),('Other Important Locations');
-- PLACEHOLDER DATA: fake coordinates, NOT real PRMSU locations. Replace in Admin.
insert into buildings(building_name,description,latitude,longitude) values('[PLACEHOLDER] Building A','Sample.',15.000,120.000),('[PLACEHOLDER] Building B','Sample.',15.001,120.001);
insert into departments(department_name,slug,category_id,building_id,description,programs) values
('[PLACEHOLDER] Sample College','placeholder-sample-college',1,1,'Placeholder record. Replace with verified information.',E'Sample program 1\nSample program 2'),
('[PLACEHOLDER] Sample Registrar','placeholder-sample-registrar',2,2,'Placeholder record. Replace with verified information.','Sample service');
