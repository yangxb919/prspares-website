import csv,re,json
rows=list(csv.DictReader(open('产品excel/agent_price_index.csv')))
sa=[r for r in rows if r['brand']=='Apple' and r['category']=='Screen Assembly'
    and 'ipad' not in (r['series']+r['product_name']).lower()]
# "OEM LCD" 条目源表零货品说明（无品牌/面板类型），2026-07-15 拍板剔除，采购澄清前不上架
sa=[r for r in sa if not re.search(r'\boem\s+lcd\b', r['product_name'], re.I)]
# 误收非屏（前玻璃/贴纸）。注意不能用宽泛 flex/glass：正品屏标题含 "Earpiece Flex Cable"
sa=[r for r in sa if not re.search(r'front glass|glass panel|sticker', r['product_name'], re.I)]

# 对外四档词典（2026-07-15 拍板），与 src/data/grade-taxonomy.ts 保持一致
GRADES={'Original','Soft OLED','Hard OLED','Incell'}

# 面板品牌 token（W3-4 品牌页，2026-07-15 拍板：先建 GX/JK 列表页）。品牌与等级
# 相关但非 1:1（如 JK 同时有 Incell 与 Soft OLED），故独立于 grade() 提取。
BRANDS=['JK','GX','DD','RJ']
def panel_brand(name):
    n=' '+name.lower()+' '
    hits=[b for b in BRANDS if re.search(r'\b'+b.lower()+r'\b',n)]
    assert len(hits)<=1, f"标题命中多个品牌 token {hits}: {name}"
    return hits[0] if hits else ''
def grade(name):
    n=' '+name.lower()+' '
    if 'incell' in n or 'in-cell' in n or 'tft' in n: return 'Incell'
    if 'original' in n or 'xdr' in n: return 'Original'
    if re.search(r'\bdd\b',n) or 'hard oled' in n: return 'Hard OLED'
    if 'oled' in n or re.search(r'\b(jk|gx|rj)\b',n): return 'Soft OLED'  # 模糊 "OLED" 归 Soft（拍板②）
    if 'lcd' in n: return 'Incell'  # 剩余 LCD 总成（YK 等）实为 incell 档（拍板④）
    return 'Other'

def model(series, name):
    s=series.strip()
    s=re.sub(r'\s*Series$','',s,flags=re.I).strip()
    return s

def num(x):
    try: return round(float(x),2)
    except: return None

# 机型排序权重(新→旧)
def mweight(m):
    mt=re.search(r'iphone\s*(\d+)',m.lower())
    base=int(mt.group(1)) if mt else 0
    if 'pro max' in m.lower(): sub=3
    elif 'pro' in m.lower(): sub=2
    elif 'plus' in m.lower(): sub=1
    elif 'mini' in m.lower(): sub=-1
    else: sub=0
    return (base, sub)

gorder={'Original':0,'Soft OLED':1,'Hard OLED':2,'Incell':3}
out=[]
for r in sa:
    p10=num(r['price_10']);
    if not p10: continue
    out.append({
        'sku': r['sku'],  # 完整 SKU：[:60] 截断曾造成 7 组 key 冲突（2026-07-15 修复）
        'model': model(r['series'],r['product_name']),
        'grade': grade(r['product_name']),
        'brand': panel_brand(r['product_name']),
        'title': re.sub(r'\s+',' ',r['product_name']).strip()[:90],
        'p10': p10, 'p50': num(r['price_50']) or p10, 'p200': num(r['price_200']) or p10,
        'image': r['image_url'] or '',
    })
out.sort(key=lambda x:(-mweight(x['model'])[0], -mweight(x['model'])[1], gorder.get(x['grade'],9), x['p10']))

# 断言套件：任何一条失败都不写文件
dup=[s for s in {o['sku'] for o in out} if sum(1 for o in out if o['sku']==s)>1]
assert not dup, f"SKU 重复: {dup}"
bad_grade=[o['title'] for o in out if o['grade'] not in GRADES]
assert not bad_grade, f"越出四档词典: {bad_grade}"
cheap=[o['title'] for o in out if o['p10']<5]
assert not cheap, f"疑似误收(<$5): {cheap}"
bad_tier=[o['title'] for o in out if not (o['p10']>=o['p50']>=o['p200'])]
assert not bad_tier, f"价格阶梯倒挂: {bad_tier}"

# 写 TS
ts="// AUTO-GENERATED from 产品excel/agent_price_index.csv by _gen_iphone_screen_catalog.py — do not edit by hand.\n"
ts+="// iPhone screen assembly wholesale catalog (real SKUs + tiered pricing).\n\n"
ts+="export interface ScreenSku {\n  sku: string;\n  model: string;\n  grade: string;\n  brand: string; // panel brand token (JK/GX/DD/RJ) or '' for unbranded\n  title: string;\n  p10: number;\n  p50: number;\n  p200: number;\n  image: string;\n}\n\n"
ts+="export const IPHONE_SCREEN_CATALOG: ScreenSku[] = "+json.dumps(out,ensure_ascii=False,indent=0).replace('}, {','},\n{')+";\n"
open('src/data/iphone-screen-catalog.ts','w').write(ts)
print(f"写出 {len(out)} 行 → src/data/iphone-screen-catalog.ts")
from collections import Counter
print("grade:",dict(Counter(o['grade'] for o in out)))
print("brand:",dict(Counter(o['brand'] or '(none)' for o in out)))
for b in BRANDS:
    bs=[o for o in out if o['brand']==b]
    if bs: print(f"  {b}: {len(bs)} SKU | grades {dict(Counter(o['grade'] for o in bs))} | ${min(o['p10'] for o in bs)}~{max(o['p10'] for o in bs)} | 机型 {len(set(o['model'] for o in bs))}")
print("机型数:",len(set(o['model'] for o in out)),"| 价格区间 $",min(o['p10'] for o in out),"~",max(o['p10'] for o in out))
